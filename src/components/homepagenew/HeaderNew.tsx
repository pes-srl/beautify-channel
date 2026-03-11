"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, Settings } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export function HeaderNew({
    initialUser = null,
    initialProfile = null
}: {
    initialUser?: SupabaseUser | null;
    initialProfile?: { role: string | null; plan_type: string | null; salon_name: string | null; trial_ends_at?: string | null } | null;
} = {}) {
    const pathname = usePathname();

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Seed state with SSR props if available, otherwise fetch
    const [user, setUser] = useState<SupabaseUser | null>(initialUser);
    const [profile, setProfile] = useState<{ role: string | null; plan_type: string | null; salon_name: string | null; trial_ends_at?: string | null } | null>(initialProfile);

    // If we already have a user from SSR, we are not loading.
    const [isLoading, setIsLoading] = useState(!initialUser);

    const supabase = createClient();

    // Sync SSR props if they change (e.g. during client-side navigation caching)
    useEffect(() => {
        if (initialUser !== undefined) {
            setUser(initialUser);
            setIsLoading(!initialUser);
        }
    }, [initialUser]);

    useEffect(() => {
        if (initialProfile !== undefined) {
            setProfile(initialProfile);
        }
    }, [initialProfile]);

    const getInitials = (name: string | null, email: string | undefined) => {
        if (!name) return email?.substring(0, 2).toUpperCase() || 'U';
        const parts = name.split(" ").filter(w => w.trim().length > 0);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        } else if (parts.length === 1) {
            return parts[0].substring(0, 2).toUpperCase();
        }
        return "??";
    };

    // Use the state values, which correctly reflect SSR or Client hydration
    const initials = getInitials(profile?.salon_name || null, user?.email || "");

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        // If we already received valid SSR data, don't double fetch on mount unless auth state changes
        const fetchUserData = async () => {
            if (initialUser) return; // Skip fetch if SSR gave us the user
            try {
                const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
                if (authError || !authUser) {
                    setUser(null);
                    setProfile(null);
                    setIsLoading(false);
                    return;
                }

                setUser(authUser);

                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('role, plan_type, salon_name, trial_ends_at')
                    .eq('id', authUser.id)
                    .single();

                if (!profileError && profileData) {
                    let pType = profileData.plan_type;
                    if (pType === 'free_trial' && profileData.trial_ends_at) {
                        const trialEndDate = new Date(profileData.trial_ends_at);
                        const daysLeft = Math.ceil((trialEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                        if (daysLeft <= 0) pType = 'free';
                    }
                    setProfile({ role: profileData.role, plan_type: pType, salon_name: profileData.salon_name, trial_ends_at: profileData.trial_ends_at });
                }
            } catch (err) {
                console.error("Error in HeaderNew fetchUser:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                const currentUser = session?.user || null;
                setUser(currentUser);

                if (currentUser) {
                    const { data: profileData } = await supabase
                        .from('profiles')
                        .select('role, plan_type, salon_name, trial_ends_at')
                        .eq('id', currentUser.id)
                        .single();
                    if (profileData) {
                        let pType = profileData.plan_type;
                        if (pType === 'free_trial' && profileData.trial_ends_at) {
                            const trialEndDate = new Date(profileData.trial_ends_at);
                            const daysLeft = Math.ceil((trialEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                            if (daysLeft <= 0) pType = 'free';
                        }
                        setProfile({ role: profileData.role, plan_type: pType, salon_name: profileData.salon_name, trial_ends_at: profileData.trial_ends_at });
                    }
                } else {
                    setProfile(null);
                }
                setIsLoading(false);
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase, initialUser]);

    const handleSignOut = () => {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/auth/signout';
        document.body.appendChild(form);
        form.submit();
    };

    const handleScrollTo = (e: React.MouseEvent, href: string) => {
        const hashIndex = href.indexOf("#");
        if (hashIndex !== -1) {
            const id = href.substring(hashIndex + 1);
            if (pathname === "/") {
                e.preventDefault();
                const element = document.getElementById(id);
                if (element) {
                    const offset = 80; // Account for header height
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = element.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });

                    // Update hash without jumping
                    window.history.pushState(null, "", `#${id}`);
                    setIsMobileMenuOpen(false);
                }
            } else {
                // Not on homepage, let default navigation run
                setIsMobileMenuOpen(false);
            }
        }
    };

    const renderRoleBadge = () => {
        const roleStr = profile?.role || "User";
        const planStr = profile?.plan_type || "Free";
        const isSmall = true;
        const baseClass = "px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider border-0";

        let planBadge = null;
        switch (planStr?.toLowerCase()) {
            case 'premiumcustomizzato':
            case 'ultra':
                planBadge = <Badge className={`bg-amber-500 hover:bg-amber-600 text-black ${baseClass}`}>Ultra</Badge>;
                break;
            case 'premium':
                planBadge = <Badge className={`bg-amber-500 hover:bg-amber-600 text-zinc-950 ${baseClass}`}>Premium</Badge>;
                break;
            case 'basic':
                planBadge = <Badge className={`bg-indigo-600 hover:bg-indigo-700 text-white ${baseClass}`}>Basic</Badge>;
                break;
            case 'free_trial':
                planBadge = <Badge className={`bg-emerald-500 hover:bg-emerald-600 text-black ${baseClass}`}>Trial</Badge>;
                break;
            case 'free':
            default:
                planBadge = <Badge className={`bg-red-600 hover:bg-red-700 text-white ${baseClass}`}>Free</Badge>;
                break;
        }

        return (
            <div className="flex gap-1.5 items-center">
                {planBadge}
                {roleStr === 'Admin' && (
                    <Badge className={`bg-red-600 hover:bg-red-700 text-white ${baseClass}`}>Admin</Badge>
                )}
            </div>
        );
    };



    const navLinks = [
        { name: "Vantaggi", href: "/#vantaggi" },
        { name: "Servizio", href: "/#servizio" },
        { name: "Prezzo", href: "/#pricing" },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b bg-zinc-950/80 backdrop-blur-lg shadow-lg ${isScrolled || pathname?.startsWith("/area-riservata") || pathname?.startsWith("/admin") ? "border-white/10" : "border-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2 group">
                        <img
                            src="https://eufahlzjxbimyiwivoiq.supabase.co/storage/v1/object/public/bucket-assets/Logo-BeautiFyChannel.svg"
                            alt="Beautify Channel Logo"
                            className="h-[52px] w-auto md:h-[50px] group-hover:scale-105 transition-transform"
                        />
                    </Link>
                </div>

                {/* Desktop Nav - Show on all pages */}
                <nav className="hidden md:flex flex-1 items-center justify-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={(e) => handleScrollTo(e, link.href)}
                            className="text-sm font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer"
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Right Side Buttons & Avatar */}
                <div className="flex items-center gap-4 ml-auto md:ml-0 flex-1 justify-end">
                    {!isLoading && user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 p-0 rounded-full border border-white/10 bg-black/50 hover:bg-white/10 flex items-center justify-center transition-colors outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm uppercase shadow-inner ${profile?.plan_type === 'premium' ? 'bg-amber-500 text-zinc-950' : profile?.plan_type === 'basic' ? 'bg-sky-500 text-zinc-950' : profile?.plan_type === 'free_trial' ? 'bg-emerald-500 text-zinc-950' : profile?.plan_type === 'free' ? 'bg-red-500 text-white' : 'bg-zinc-800 text-zinc-300'}`}>
                                        {initials}
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-64 bg-zinc-950 border border-white/10 shadow-2xl rounded-xl p-2 mt-2">
                                <div className="px-3 py-3 border-b border-white/5 mb-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-white">Il mio account</span>
                                        {renderRoleBadge()}
                                    </div>
                                    <p className="text-xs text-zinc-400 mt-1 truncate">{user.email}</p>
                                </div>
                                <DropdownMenuItem asChild className="cursor-pointer focus:bg-white/10 rounded-lg px-3 py-2.5">
                                    <Link href="/area-riservata" className="flex items-center gap-3 w-full">
                                        <User className="w-4 h-4 text-zinc-400" />
                                        <span className="text-zinc-200">Area riservata</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="cursor-pointer focus:bg-white/10 rounded-lg px-3 py-2.5 mt-1">
                                    <Link href="/area-riservata/le-mie-richieste" className="flex items-center gap-3 w-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400"><path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                                        <span className="text-zinc-200">Le mie Richieste</span>
                                    </Link>
                                </DropdownMenuItem>
                                {profile?.role === 'Admin' && (
                                    <>
                                        <DropdownMenuSeparator className="bg-white/5 my-2" />
                                        <div className="px-3 py-1.5 text-[10px] font-semibold text-zinc-500 tracking-wider uppercase">Amministrazione</div>
                                        <DropdownMenuItem asChild className="cursor-pointer focus:bg-white/10 rounded-lg px-3 py-2.5">
                                            <Link href="/admin" className="flex items-center gap-3 w-full">
                                                <Settings className="w-4 h-4 text-zinc-400" />
                                                <span className="text-zinc-200">Gestione Admin</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    </>
                                )}
                                <DropdownMenuSeparator className="bg-white/5 my-2" />
                                <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleSignOut(); }} className="cursor-pointer focus:bg-red-500/20 rounded-lg px-3 py-2.5 text-red-100 focus:text-red-500">
                                    <div className="flex items-center gap-3 w-full">
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </div>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : !isLoading ? (
                        <>
                            <Link
                                href="/#trial-form"
                                onClick={(e) => handleScrollTo(e, "/#trial-form")}
                                className="hidden md:inline-block"
                            >
                                <Button
                                    className="bg-[#7B2CBF] hover:bg-[#6A25A3] text-white transition-all font-bold border-0 shadow-lg shadow-[#2D0A4E]/20 rounded-[35px]"
                                >
                                    Prova GRATUITA
                                </Button>
                            </Link>
                            <Link href="/login" className="hidden md:inline-block">
                                <Button className="bg-[#7B2CBF] hover:bg-[#6A25A3] text-white transition-all font-bold border-0 shadow-lg shadow-[#2D0A4E]/20 rounded-[35px] flex items-center gap-2">
                                    <User className="w-4 h-4 text-white" />
                                    Accedi
                                </Button>
                            </Link>
                        </>
                    ) : null}
                </div>

                {/* Mobile Menu Toggle & Direct Access */}
                <div className="md:hidden flex items-center gap-3">
                    <Link
                        href={user ? "/area-riservata" : "/login"}
                        className="text-zinc-300 hover:text-white p-1"
                        aria-label="Accesso rapido"
                    >
                        <User size={22} className={user && profile?.plan_type === 'premium' ? "text-amber-500" : ""} />
                    </Link>
                    <button
                        className="text-zinc-300 hover:text-white"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-zinc-950 border-b border-white/10 p-6 flex flex-col gap-4 shadow-xl">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-lg font-medium text-zinc-300 hover:text-white py-2 block border-b border-white/5 cursor-pointer"
                            onClick={(e) => handleScrollTo(e, link.href)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="flex flex-col gap-3 mt-4">
                        {!isLoading && user ? (
                            <>
                                <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="outline" className="w-full border-white/20 text-white bg-transparent flex items-center justify-center gap-2 rounded-[35px]">
                                        <User size={18} />
                                        Area Personale
                                    </Button>
                                </Link>
                                <Button onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }} className="w-full bg-white/10 hover:bg-white/20 text-white border-0 flex items-center justify-center gap-2 cursor-pointer transition-colors rounded-[35px]">
                                    <LogOut size={18} />
                                    Esci
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="outline" className="w-full border-white/20 text-white bg-transparent rounded-[35px]">
                                        Accedi
                                    </Button>
                                </Link>
                                <Link
                                    href="/#trial-form"
                                    onClick={(e) => handleScrollTo(e, "/#trial-form")}
                                >
                                    <Button
                                        className="w-full bg-[#7B2CBF] hover:bg-[#6A25A3] text-white transition-all font-bold border-0 shadow-lg rounded-[35px]"
                                    >
                                        Prova GRATUITA
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
