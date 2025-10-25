import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogoutLink, PortalLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { CreditCard, LogOut, User } from 'lucide-react';

const user = {
  given_name: 'Shad',
  family_name: 'Cotson',
  picture: 'https://github.com/shadcn.png',
};

export function SidebarUserInfo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="size-12 rounded-xl hover:rounded-lg transition-all duration-200 bg-background/50 border-border/50 hover:bg-accent hover:text-accent"
        >
          <Avatar>
            <AvatarImage src={user.picture} alt="User Image" className="object-cover" />\
            <AvatarFallback>
              {' '}
              {(user.given_name[0] + user.family_name[0]).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="right" sideOffset={8} className="w-[200px]">
        <DropdownMenuLabel className="font-normal flex items-center gap-2 px-1 py-2 text-left text-sm">
          <Avatar className="relative size-8 rounded-lg">
            <AvatarImage src={user.picture} alt="User Image" className="object-cover" />\
            <AvatarFallback>
              {' '}
              {(user.given_name[0] + user.family_name[0]).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className=" grid flex-1 text-left text-sm leading-tight">
            <p className="truncate font-medium">{user.given_name}</p>
            <p className="truncate text-xs leading-none text-muted-foreground">
              {user.family_name}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <PortalLink>
              <User />
              Account
            </PortalLink>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <PortalLink>
              <CreditCard />
              Biiling
            </PortalLink>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <LogoutLink>
              <LogOut /> Logout
            </LogoutLink>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
