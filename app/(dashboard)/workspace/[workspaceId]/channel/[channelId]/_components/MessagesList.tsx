import { useInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';
import { MessageItem } from './message/MessageItem';
import { orpc } from '@/lib/orpc';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MessagesList() {
  const { channelId } = useParams<{ channelId: string }>();

  const {
    data: { user },
  } = useSuspenseQuery(orpc.workspace.list.queryOptions());

  const [hasInitialScrolled, setHasInitialScrolled] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef(0);
  const prevScrollHeightRef = useRef(0);
  const isNearBottomRef = useRef(true);
  const lastMessageIdRef = useRef<string | null>(null);
  const pendingScrollRef = useRef(false);
  const imageLoadingRef = useRef(new Set<string>());

  const infiniteQueryOptions = orpc.message.list.infiniteOptions({
    input: (pageParam: string | undefined) => ({
      channelId: channelId!,
      limit: 30,
      cursor: pageParam,
    }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage: any) => {
      return lastPage.hasMore ? lastPage.nextCursor : undefined;
    },
    select: (data) => ({
      pages: [...data.pages].reverse().map((page) => ({
        ...page,
        items: page.items.slice().reverse(),
      })),
      pageParams: [...data.pageParams].reverse(),
    }),
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } =
    useInfiniteQuery({
      ...infiniteQueryOptions,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    });

  const messages = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data?.pages]);

  const lastMessageId = messages[messages.length - 1]?.id;
  const lastMessageAuthorId = messages[messages.length - 1]?.authorId;

  const checkIfNearBottom = (container: HTMLDivElement, threshold = 150) => {
    const scrollBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    return scrollBottom < threshold;
  };

  // Force scroll to bottom helper
  const forceScrollToBottom = (smooth = false) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (smooth) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    } else {
      container.scrollTop = container.scrollHeight;
    }
    isNearBottomRef.current = true;
  };

  // Track scroll position
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const isNearBottom = checkIfNearBottom(container);
      isNearBottomRef.current = isNearBottom;
      setShowScrollButton(!isNearBottom);
    };

    handleScroll();
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [messages.length]);

  // Auto scroll logic
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || messages.length === 0) return;

    if (!hasInitialScrolled) {
      // Initial scroll - wait a bit for images
      setTimeout(() => {
        forceScrollToBottom(false);
      }, 100);
      setHasInitialScrolled(true);
      prevMessagesLengthRef.current = messages.length;
      prevScrollHeightRef.current = container.scrollHeight;
      isNearBottomRef.current = true;
      lastMessageIdRef.current = messages[messages.length - 1]?.id || null;
      return;
    }

    const messagesAdded = messages.length - prevMessagesLengthRef.current;

    if (messagesAdded > 0) {
      const latestMessage = messages[messages.length - 1];
      const currentLastMessageId = latestMessage?.id;
      const isNewMessageAtBottom = currentLastMessageId !== lastMessageIdRef.current;

      if (isNewMessageAtBottom) {
        const isMyMessage = latestMessage?.authorId === user.id;

        if (isMyMessage || isNearBottomRef.current) {
          pendingScrollRef.current = true;

          // For my messages, scroll immediately and keep trying
          if (isMyMessage) {
            forceScrollToBottom(false);
            // Keep scrolling as content loads
            const scrollInterval = setInterval(() => {
              forceScrollToBottom(false);
            }, 50);

            setTimeout(() => {
              clearInterval(scrollInterval);
              pendingScrollRef.current = false;
            }, 2000); // Keep scrolling for 2 seconds
          } else {
            forceScrollToBottom(true);
            setTimeout(() => {
              pendingScrollRef.current = false;
            }, 1000);
          }
        }

        lastMessageIdRef.current = currentLastMessageId;
      } else {
        // Loading older messages - maintain scroll position
        const heightDifference = container.scrollHeight - prevScrollHeightRef.current;
        if (heightDifference > 0) {
          container.scrollTop = container.scrollTop + heightDifference;
        }
      }
    }

    prevMessagesLengthRef.current = messages.length;
    prevScrollHeightRef.current = container.scrollHeight;
  }, [messages, messages.length, hasInitialScrolled, user.id]);

  // Enhanced image loading handler
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleImageLoad = (img: HTMLImageElement) => {
      const imgSrc = img.src;
      imageLoadingRef.current.delete(imgSrc);

      // Scroll if we should
      if (pendingScrollRef.current || isNearBottomRef.current) {
        console.log('🖼️ Image loaded, scrolling to bottom');
        requestAnimationFrame(() => {
          forceScrollToBottom(false);
        });
      }
    };

    const handleImageError = (img: HTMLImageElement) => {
      const imgSrc = img.src;
      imageLoadingRef.current.delete(imgSrc);
    };

    // Get all images
    const images = container.querySelectorAll('img');

    images.forEach((img) => {
      const imgSrc = img.src;

      if (!img.complete) {
        // Image is loading
        imageLoadingRef.current.add(imgSrc);

        const onLoad = () => {
          handleImageLoad(img);
          img.removeEventListener('load', onLoad);
          img.removeEventListener('error', onError);
        };

        const onError = () => {
          handleImageError(img);
          img.removeEventListener('load', onLoad);
          img.removeEventListener('error', onError);
        };

        img.addEventListener('load', onLoad);
        img.addEventListener('error', onError);
      } else if (img.naturalHeight === 0) {
        // Image failed to load
        imageLoadingRef.current.delete(imgSrc);
      } else {
        // Image already loaded, scroll now if needed
        if (pendingScrollRef.current || isNearBottomRef.current) {
          requestAnimationFrame(() => {
            forceScrollToBottom(false);
          });
        }
      }
    });

    // Also use MutationObserver to catch newly added images
    const observer = new MutationObserver(() => {
      if (pendingScrollRef.current || isNearBottomRef.current) {
        requestAnimationFrame(() => {
          forceScrollToBottom(false);
        });
      }
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src', 'height'],
    });

    return () => {
      observer.disconnect();
    };
  }, [messages.length]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const container = scrollContainerRef.current;
          if (container) {
            prevScrollHeightRef.current = container.scrollHeight;
          }
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const scrollToBottom = () => {
    forceScrollToBottom(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-sm text-gray-500">Loading messages...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-sm text-red-500">Error loading messages</div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <div ref={scrollContainerRef} className="h-full overflow-y-auto px-4">
        {hasNextPage && (
          <div ref={loadMoreRef} className="py-2 text-center text-sm text-gray-500">
            {isFetchingNextPage ? 'Loading more messages...' : 'Scroll up to load more'}
          </div>
        )}
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            onImageLoad={() => {
              if (pendingScrollRef.current || isNearBottomRef.current) {
                requestAnimationFrame(() => {
                  forceScrollToBottom(false);
                });
              }
            }}
          />
        ))}
      </div>

      {showScrollButton && (
        <Button
          onClick={scrollToBottom}
          size="icon"
          variant="default"
          className="absolute bottom-4 right-8 z-50 h-10 w-10 rounded-full shadow-lg transition-all hover:shadow-xl"
          aria-label="Scroll to bottom"
        >
          <ArrowDown className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
