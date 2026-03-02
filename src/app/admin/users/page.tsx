import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { createClient } from "@/utils/supabase/server";
import { UserRowActions } from "./UserRowActions";

export const dynamic = "force-dynamic";

export default async function UsersManagementPage() {
    const supabase = await createClient();

    // Fetch all profiles from the database, newest first
    const { data: users, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

    // Fallback to empty array in case of error
    const profiles = users || [];

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Istituti & Utenti</h1>
                    <p className="text-zinc-400">Gestisci i piani, gli abbonamenti e i ruoli dei tuoi clienti.</p>
                </div>
                {/* 
                <Button className="bg-white text-zinc-950 hover:bg-zinc-200 shadow-[0_0_20px_-5px_rgba(255,255,255,0.2)]">
                    Add New User
                </Button>
                */}
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
                <Table>
                    <TableHeader className="bg-zinc-950/50">
                        <TableRow className="border-white/10 hover:bg-transparent">
                            <TableHead className="text-zinc-400 font-medium">Nome Istituto</TableHead>
                            <TableHead className="text-zinc-400 font-medium">Email</TableHead>
                            <TableHead className="text-zinc-400 font-medium">Role</TableHead>
                            <TableHead className="text-zinc-400 font-medium">Abbonamento</TableHead>
                            <TableHead className="text-zinc-400 font-medium">Status</TableHead>
                            <TableHead className="text-right text-zinc-400 font-medium">Azioni</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {profiles.map((user) => (
                            <TableRow key={user.id} className="border-white/10 hover:bg-white/5 transition-colors">
                                <TableCell className="font-medium text-zinc-100">{user.salon_name || "Senza Nome"}</TableCell>
                                <TableCell className="text-zinc-400">{user.email}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={user.role === 'Admin' ? 'text-red-400 border-red-400/50' : 'text-zinc-300 border-white/20'}>
                                        {user.role === 'Admin' ? 'Admin' : 'User'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={`
                                        bg-transparent uppercase text-[10px] font-bold tracking-wider
                                        ${user.plan_type === 'premium' ? 'text-fuchsia-400 border-fuchsia-400/50' :
                                            user.plan_type === 'free_trial' ? 'text-emerald-400 border-emerald-400/50' :
                                                user.plan_type === 'basic' ? 'text-indigo-400 border-indigo-400/50' :
                                                    'text-zinc-400 border-zinc-500/30'}
                                    `}>
                                        {user.plan_type ? user.plan_type.replace('_', ' ') : 'free'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 relative pl-4">
                                        <span className={`w-2 h-2 rounded-full absolute left-0 ${user.plan_status === 'active' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`} />
                                        <span className={user.plan_status === 'active' ? 'text-zinc-300 capitalize' : 'text-zinc-500 capitalize'}>{user.plan_status || 'active'}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <UserRowActions user={{
                                        id: user.id,
                                        role: user.role,
                                        plan_type: user.plan_type,
                                        salon_name: user.salon_name
                                    }} />
                                </TableCell>
                            </TableRow>
                        ))}
                        {profiles.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-zinc-500">
                                    Nessun utente trovato nel database.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
