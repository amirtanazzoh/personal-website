import { HomeIcon, LogOut, NewspaperIcon, SettingsIcon, User2Icon } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { Separator } from "../ui/separator";

const general_items = [
    {
        title: "Home",
        url: "/admin/dashboard",
        icon: HomeIcon,
    },
];

const post_types_items = [
    {
        title: "Posts",
        url: "/admin/posts",
        icon: NewspaperIcon,
    },
];


export default function AdminSidebar ()
{
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="h-16 group-data-[state=collapsed]:h-12 flex justify-center items-center">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton variant={ 'default' } >
                            {/* #TODO: Add user image */ }
                            <User2Icon className="size-7" />
                            {/* #TODO: Add user name from api */ }
                            <span className="text-lg font-medium">Amir Tanazzoh</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <Separator />

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>General</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            { general_items.map( ( item ) => (
                                <SidebarMenuItem key={ item.title }>
                                    <SidebarMenuButton asChild>
                                        <a href={ item.url }>
                                            <item.icon />
                                            <span>{ item.title }</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ) ) }
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Post Types</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            { post_types_items.map( ( item ) => (
                                <SidebarMenuItem key={ item.title }>
                                    <SidebarMenuButton asChild>
                                        <a href={ item.url }>
                                            <item.icon />
                                            <span>{ item.title }</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ) ) }
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

            </SidebarContent>

            <SidebarFooter >
                <SidebarGroupLabel>Settings</SidebarGroupLabel>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <a href="#">
                                <SettingsIcon />
                                <span>Account Settings</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <a href="#">
                                <LogOut />
                                <span>Logout</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}