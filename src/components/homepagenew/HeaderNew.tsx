"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, Settings, Sparkles } from "lucide-react";
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
    initialProfile?: { role: string | null; plan_type: string | null; salon_name: string | null; trial_ends_at?: string | null; subscription_expiration?: string | null; store_license_url?: string | null; store_contract_url?: string | null } | null;
} = {}) {
    const pathname = usePathname();

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Seed state with SSR props if available, otherwise fetch
    const [user, setUser] = useState<SupabaseUser | null>(initialUser);
    const [profile, setProfile] = useState<{ role: string | null; plan_type: string | null; salon_name: string | null; trial_ends_at?: string | null; subscription_expiration?: string | null; store_license_url?: string | null; store_contract_url?: string | null } | null>(initialProfile);

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
    
    // --- CALCOLO GIORNI TRIAL / SCADENZA ABBONAMENTO ---
    let daysLeft = 0;
    if (profile?.plan_type === 'free_trial' && profile?.trial_ends_at) {
        const trialEndDate = new Date(profile.trial_ends_at);
        const now = new Date();
        const diffTime = trialEndDate.getTime() - now.getTime();
        daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (daysLeft < 1 && diffTime > 0) daysLeft = 1;
    }

    let formattedExpiration = "";
    if (['basic', 'premium', 'premiumcustomizzato'].includes(profile?.plan_type || '') && profile?.subscription_expiration) {
        const expDate = new Date(profile.subscription_expiration);
        formattedExpiration = new Intl.DateTimeFormat('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(expDate);
    }

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
                    .select('role, plan_type, salon_name, trial_ends_at, subscription_expiration, store_license_url, store_contract_url')
                    .eq('id', authUser.id)
                    .single();

                if (!profileError && profileData) {
                    let pType = profileData.plan_type;
                    if (pType === 'free_trial' && profileData.trial_ends_at) {
                        const trialEndDate = new Date(profileData.trial_ends_at);
                        const now = new Date();
                        const diffTime = trialEndDate.getTime() - now.getTime();
                        const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        if (daysLeft < 0) pType = 'free';
                    }
                    setProfile({
                        role: profileData.role, 
                        plan_type: pType, 
                        salon_name: profileData.salon_name, 
                        trial_ends_at: profileData.trial_ends_at, 
                        subscription_expiration: profileData.subscription_expiration,
                        store_license_url: profileData.store_license_url,
                        store_contract_url: profileData.store_contract_url
                    });
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
                        .select('role, plan_type, salon_name, trial_ends_at, subscription_expiration, store_license_url, store_contract_url')
                        .eq('id', currentUser.id)
                        .single();
                    if (profileData) {
                        let pType = profileData.plan_type;
                        if (pType === 'free_trial' && profileData.trial_ends_at) {
                            const trialEndDate = new Date(profileData.trial_ends_at);
                            const now = new Date();
                            const diffTime = trialEndDate.getTime() - now.getTime();
                            const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            if (daysLeft < 0) pType = 'free';
                        }
                        setProfile({
                            role: profileData.role, 
                            plan_type: pType, 
                            salon_name: profileData.salon_name, 
                            trial_ends_at: profileData.trial_ends_at, 
                            subscription_expiration: profileData.subscription_expiration,
                            store_license_url: profileData.store_license_url,
                            store_contract_url: profileData.store_contract_url
                        });
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

    // Polling mechanism if returning from Stripe (upgrade=success) and still seeing free_trial
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const searchParams = new URLSearchParams(window.location.search);
        const upgradeParam = searchParams.get('upgrade');

        if (upgradeParam !== 'success' || !user || !profile) return;

        // Only poll if it still looks like a trial/free plan but user just paid
        if (profile.plan_type !== 'free_trial' && profile.plan_type !== 'free') return;

        let pollingCount = 0;
        const maxPolls = 8; // Poll for about 12 seconds total

        const pollTimer = setInterval(async () => {
            pollingCount++;
            try {
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('role, plan_type, salon_name, trial_ends_at, subscription_expiration, store_license_url, store_contract_url')
                    .eq('id', user.id)
                    .single();

                if (profileData && profileData.plan_type !== 'free_trial' && profileData.plan_type !== 'free') {
                    // Plan has finally updated securely!
                    setProfile({
                        role: profileData.role,
                        plan_type: profileData.plan_type,
                        salon_name: profileData.salon_name,
                        trial_ends_at: profileData.trial_ends_at,
                        subscription_expiration: profileData.subscription_expiration,
                        store_license_url: profileData.store_license_url,
                        store_contract_url: profileData.store_contract_url
                    });
                    clearInterval(pollTimer);
                } else if (pollingCount >= maxPolls) {
                    clearInterval(pollTimer);
                }
            } catch (err) {
                console.error("Polling error:", err);
            }
        }, 1500);

        return () => clearInterval(pollTimer);
    }, [user, profile?.plan_type, supabase]);

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
                planBadge = <Badge className={`bg-[#ff7393] hover:brightness-110 text-white ${baseClass}`}>Basic</Badge>;
                break;
            case 'free_trial':
                planBadge = <Badge className={`bg-purple-400 hover:bg-purple-500 text-black ${baseClass}`}>Trial</Badge>;
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
            <div className="max-w-7xl mx-auto px-6 h-14 md:h-16 lg:h-20 flex items-center justify-between relative">
                {/* Logo & Desktop Nav (Left Aligned) */}
                <div className="flex items-center gap-10">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <img
                            src="https://eufahlzjxbimyiwivoiq.supabase.co/storage/v1/object/public/bucket-assets/Logo-BeautiFyChannel.svg"
                            alt="Beautify Channel Logo"
                            className="h-8 md:h-10 xl:h-12 w-auto group-hover:scale-105 transition-transform"
                        />
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={(e) => handleScrollTo(e, link.href)}
                                className="text-base font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Right Side Buttons & Avatar */}
                <div className="flex items-center gap-4 ml-auto md:ml-0 flex-1 justify-end">
                    {!isLoading && user ? (
                        <div className="flex items-center gap-3">
                            {/* Prova Gratuita Badge (PC Only) */}
                            {profile?.plan_type === 'free_trial' && daysLeft > 0 && (
                                <div className="hidden md:flex items-center gap-3 bg-gradient-to-r from-purple-500/20 via-[#2a1154]/40 to-[#ff5a7e]/10 border border-white/20 px-6 py-2.5 rounded-2xl backdrop-blur-xl shadow-2xl shadow-purple-950/20 whitespace-nowrap">
                                    <Sparkles className="w-5 h-5 text-purple-400 animate-pulse shrink-0" />
                                    <div className="flex flex-col items-start gap-0.5">
                                        <span className="text-[11px] lg:text-[13px] font-bold text-white uppercase tracking-wider leading-tight">
                                            La tua formula Free Trial è stata attivata
                                        </span>
                                        <span className="text-[9px] lg:text-[11px] font-medium text-zinc-400 italic leading-tight">
                                            <span className="text-purple-400 font-bold">{daysLeft}</span> {daysLeft === 1 ? 'giorno' : 'giorni'} alla scadenza della tua prova gratuita
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* BASIC/PREMIUM Plan Badge (PC Only) */}
                            {['basic', 'premium', 'premiumcustomizzato'].includes(profile?.plan_type || '') && (
                                <div className={`hidden md:flex items-center gap-3 bg-gradient-to-r ${profile?.plan_type === 'basic' ? 'from-[#ff7393]/20 via-[#4e0f1e]/40 to-[#ff7393]/10 border border-white/20' : 'from-amber-500/20 via-[#4e3a0f]/40 to-amber-500/10 border border-white/20'} px-6 py-2.5 rounded-2xl backdrop-blur-xl shadow-2xl ${profile?.plan_type === 'basic' ? 'shadow-[#ff7393]/10' : 'shadow-amber-500/10'} whitespace-nowrap`}>
                                    <Sparkles className={`w-5 h-5 ${profile?.plan_type === 'basic' ? 'text-[#ff7393]' : 'text-amber-400'} animate-pulse shrink-0`} />
                                    <div className="flex flex-col items-start gap-0.5">
                                        <span className="text-[11px] lg:text-[13px] font-bold text-white uppercase tracking-wider leading-tight">
                                            Il Tuo Piano <span className={profile?.plan_type === 'basic' ? 'text-[#ff7393]' : 'text-amber-400'}>{profile?.plan_type === 'basic' ? 'BASIC' : 'PREMIUM'}</span> è ATTIVO
                                        </span>
                                        <span className="text-[9px] lg:text-[11px] font-medium text-zinc-400 italic leading-tight">
                                            {formattedExpiration ? (
                                                <>Scadenza prevista: <span className={`${profile?.plan_type === 'basic' ? 'text-[#ff7393]' : 'text-amber-400'} font-bold`}>{formattedExpiration}</span></>
                                            ) : (
                                                "Abbonamento in corso"
                                            )}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative group flex items-center justify-center h-10 w-10 md:w-auto md:px-3 rounded-full border border-white/10 bg-black/50 hover:bg-white/10 transition-all outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[11px] uppercase shadow-inner shrink-0 ${profile?.plan_type === 'premium' ? 'bg-amber-500 text-zinc-950' : profile?.plan_type === 'basic' ? 'bg-[#ff7393] text-zinc-950' : profile?.plan_type === 'free_trial' ? 'bg-purple-400 text-zinc-950' : profile?.plan_type === 'free' ? 'bg-red-500 text-white' : 'bg-zinc-800 text-zinc-300'}`}>
                                        {initials}
                                    </div>
                                    <div className="hidden md:flex flex-col items-start ml-2.5 leading-none pr-1">
                                        <span className="text-[10px] font-bold text-white uppercase tracking-widest mb-0.5">Account</span>
                                        <span className="text-[8px] font-medium text-zinc-500 group-hover:text-purple-400 transition-colors uppercase tracking-widest">Impostazioni</span>
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
                                    <Link href="/area-riservata/profilo" className="flex items-center gap-3 w-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                        <span className="text-zinc-200">Il Mio Profilo</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="cursor-pointer focus:bg-white/10 rounded-lg px-3 py-2.5 mt-1">
                                    <Link href="/area-riservata/ordini" className="flex items-center gap-3 w-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                                        <span className="text-zinc-200">I Miei Ordini</span>
                                    </Link>
                                </DropdownMenuItem>
                                {profile?.plan_type !== 'free_trial' && (profile?.store_license_url || profile?.store_contract_url) && (
                                    <DropdownMenuItem asChild className="cursor-pointer focus:bg-white/10 rounded-lg px-3 py-2.5 mt-1">
                                        <Link href="/area-riservata/documenti" className="flex items-center gap-3 w-full">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                                            <span className="text-zinc-200">Documenti e Licenza</span>
                                        </Link>
                                    </DropdownMenuItem>
                                )}
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
                        </div>
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
                    {!user && (
                        <Link
                            href="/login"
                            className="text-zinc-300 hover:text-white p-1"
                            aria-label="Accesso rapido"
                        >
                            <User size={22} />
                        </Link>
                    )}
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
                                <Link href="/area-riservata" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="outline" className="w-full border-white/20 text-white bg-transparent flex items-center justify-center gap-2 rounded-[35px]">
                                        <User size={18} />
                                        Area Riservata
                                    </Button>
                                </Link>
                                <Link href="/area-riservata/profilo" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="outline" className="w-full border-white/20 text-white bg-transparent flex items-center justify-center gap-2 rounded-[35px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                        Il Mio Profilo
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
