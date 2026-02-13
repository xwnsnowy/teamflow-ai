import React from 'react';
import Link from 'next/link';
import { ArrowRight, Terminal, Cpu, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { TextEffect } from '@/components/ui/text-effect';
import { AnimatedGroup } from '@/components/ui/animated-group';
import { Variants } from 'motion/react';

const transitionVariants = {
  item: {
    hidden: { opacity: 0, filter: 'blur(12px)', y: 20 },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: { type: 'spring', bounce: 0.3, duration: 1.2 },
    },
  },
};

export default function HeroSection() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground transition-colors duration-500">
      {/* --- DYNAMIC BACKGROUND LAYER --- */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Lưới Grid: Light mode dùng xám nhạt, Dark mode dùng xám đậm */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,met-zinc-500/10_1px,transparent_1px),linear-gradient(to_bottom,met-zinc-500/10_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* Glow Effects: Thay đổi theo mode thông qua opacity */}
        <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 h-[500px] w-full max-w-[800px] rounded-full bg-primary/20 blur-[120px] dark:bg-primary/10" />
      </div>

      <section className="relative z-10 pt-24 md:pt-36">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center text-center">
            <AnimatedGroup variants={transitionVariants as Variants}>
              <Link
                href="#link"
                className="group relative flex items-center gap-3 border border-border bg-muted/50 px-4 py-1.5 backdrop-blur-md transition-all hover:border-primary/50"
                style={{
                  clipPath:
                    'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
                }}
              >
                <Terminal className="size-4 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                  System Status: <span className="text-primary">Operational</span>
                </span>
                <div className="ml-2 flex h-5 w-5 items-center justify-center bg-foreground transition-colors group-hover:bg-primary">
                  <ArrowRight className="size-3 text-background" />
                </div>
              </Link>
            </AnimatedGroup>

            <div className="mt-10">
              <h1 className="text-5xl font-black italic tracking-tighter sm:text-7xl lg:text-8xl uppercase">
                <TextEffect preset="fade-in-blur" as="span" className="block">
                  Future-Ready
                </TextEffect>
                <span className="relative inline-block text-primary dark:drop-shadow-[0_0_15px_rgba(var(--primary),0.4)]">
                  <TextEffect preset="fade-in-blur" as="span" className="block">
                    Workspace
                  </TextEffect>
                  <span className="absolute -bottom-2 left-0 h-1 w-full bg-primary/30" />
                </span>
              </h1>
            </div>

            <TextEffect
              per="line"
              preset="fade-in-blur"
              delay={0.5}
              as="p"
              className="mt-8 max-w-2xl text-lg font-medium text-muted-foreground"
            >
              Streamlines team communication with real-time threads, smart channels, and AI-driven
              coordination.
            </TextEffect>

            <AnimatedGroup
              variants={
                {
                  container: {
                    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.8 } },
                  },
                  ...transitionVariants,
                } as Variants
              }
              className="mt-12 flex flex-col gap-4 sm:flex-row"
            >
              <Button
                size="lg"
                className="group relative h-12 rounded-none bg-foreground px-8 font-bold text-background hover:bg-primary hover:text-primary-foreground"
                style={{ clipPath: 'polygon(12% 0, 100% 0, 100% 70%, 88% 100%, 0 100%, 0 30%)' }}
              >
                GET STARTED
                <Zap className="ml-2 size-4 fill-current transition-transform group-hover:scale-125" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 rounded-none border-2 border-border bg-transparent px-8 font-bold hover:bg-muted"
                style={{ clipPath: 'polygon(12% 0, 100% 0, 100% 70%, 88% 100%, 0 100%, 0 30%)' }}
              >
                REQUEST DEMO
              </Button>
            </AnimatedGroup>
          </div>
        </div>
        x{' '}
        <div className="relative mx-auto mt-20 max-w-6xl px-6 md:mt-32">
          <div className="absolute -left-2 -top-2 z-20 size-8 border-l-2 border-t-2 border-primary" />
          <div className="absolute -right-2 -bottom-2 z-20 size-8 border-r-2 border-b-2 border-primary/40" />

          <div className="group relative overflow-hidden border border-border bg-card shadow-2xl transition-all hover:border-primary/30">
            <div className="absolute inset-0 z-10 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.05)_50%)] bg-[size:100%_4px] pointer-events-none dark:bg-[linear-gradient(transparent_50%,rgba(255,255,255,0.02)_50%)]" />

            <Image
              src="/mail2.png"
              alt="app screen"
              width={2700}
              height={1440}
              className="hidden h-auto w-full dark:block"
            />
            <Image
              src="/mail2-light.png"
              alt="app screen"
              width={2700}
              height={1440}
              className="block h-auto w-full dark:hidden"
            />
          </div>
        </div>
      </section>

      <section className="py-24 opacity-60 transition-opacity hover:opacity-100">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 grayscale dark:invert">
            {['nvidia', 'github', 'openai', 'nike'].map((brand) => (
              <Image
                key={brand}
                src={`https://html.tailus.io/blocks/customers/${brand}.svg`}
                alt={brand}
                height={20}
                width={100}
                className="h-5 w-auto"
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
