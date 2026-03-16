const fs = require('fs');
const path = '/Users/mirkodgz/Projects/criss-dell-orto/beautify-channel/src/components/homepagenew/HeaderNew.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
    'store_license_url?: string | null } | null;',
    'store_license_url?: string | null; store_contract_url?: string | null } | null;'
).replace(
    'store_license_url?: string | null } | null>(initialProfile);',
    'store_license_url?: string | null; store_contract_url?: string | null } | null>(initialProfile);'
).replace(
    /select\('role, plan_type, salon_name, trial_ends_at, store_license_url'\)/g,
    "select('role, plan_type, salon_name, trial_ends_at, store_license_url, store_contract_url')"
).replace(
    /store_license_url: profileData.store_license_url \}\);/g,
    "store_license_url: profileData.store_license_url, store_contract_url: profileData.store_contract_url });"
).replace(
    /store_license_url: profileData.store_license_url/g,
    "store_license_url: profileData.store_license_url,\n                        store_contract_url: profileData.store_contract_url"
);

// Update dropdown menu logic
const oldDropdown = `{profile?.store_license_url && (
                                    <DropdownMenuItem asChild className="cursor-pointer focus:bg-white/10 rounded-lg px-3 py-2.5 mt-1">
                                        <a href={profile.store_license_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 w-full">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                                            <span className="text-zinc-200">Documenti (Licenza)</span>
                                        </a>
                                    </DropdownMenuItem>
                                )}`;

const newDropdown = `{(profile?.store_license_url || profile?.store_contract_url) && (
                                    <DropdownMenuItem asChild className="cursor-pointer focus:bg-white/10 rounded-lg px-3 py-2.5 mt-1">
                                        <Link href="/area-riservata/documenti" className="flex items-center gap-3 w-full">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                                            <span className="text-zinc-200">Documenti e Licenza</span>
                                        </Link>
                                    </DropdownMenuItem>
                                )}`;

content = content.replace(oldDropdown, newDropdown);

fs.writeFileSync(path, content, 'utf8');
console.log('HeaderNew updated successfully.');
