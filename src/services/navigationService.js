// Mega Menu Data
const NAVIGATION_TREE = [
    {
        id: 'necktie',
        label: 'Necktie',
        path: '/collection/necktie',
        subs: [
            { id: 'zipper', label: 'Zipper', path: '/collection/zipper-tie' },
            { id: 'solid', label: 'Solid', path: '/collection/solid-tie' },
            { id: 'silk', label: 'Silk', path: '/collection/silk-tie' },
            { id: 'printed', label: 'Printed', path: '/collection/printed-tie' }
        ]
    },
    {
        id: 'bowtie',
        label: 'Bowtie',
        path: '/collection/bowtie',
        subs: [
            { id: 'solid-bow', label: 'Solid', path: '/collection/solid-bowtie' },
            { id: 'open-bow', label: 'Open', path: '/collection/open-bowtie' },
            { id: 'velvet-bow', label: 'Velvet', path: '/collection/velvet-bowtie' }
        ]
    },
    {
        id: 'pocket-square',
        label: 'Pocket Square',
        path: '/collection/pocket-square',
        subs: [
            { id: 'solid-ps', label: 'Solid', path: '/collection/solid-pocket-square' },
            { id: 'silk-ps', label: 'Silk', path: '/collection/silk-pocket-square' },
            { id: 'printed-ps', label: 'Printed Silk', path: '/collection/printed-silk-pocket-square' }
        ]
    },
    {
        id: 'cufflink',
        label: 'Cufflink',
        path: '/collection/cufflink',
        subs: [
            { id: 'cufflinks-sub', label: 'Cufflinks', path: '/collection/cufflinks' }
        ]
    },
    {
        id: 'cravat',
        label: 'Cravat',
        path: '/collection/cravat',
        subs: [
            { id: 'silk-cravat', label: 'Silk Cravat', path: '/collection/silk-cravat' }
        ]
    },
    {
        id: 'brooch',
        label: 'Brooch',
        path: '/collection/brooch',
        subs: [
            { id: 'metal-brooch', label: 'Metal Brooch', path: '/collection/metal-brooch' }
        ]
    },
    {
        id: 'tie-pin',
        label: 'Tie Pin',
        path: '/collection/tie-pin',
        subs: [
            { id: 'tie-pin-sub', label: 'Tie Pin', path: '/collection/tie-pin' }
        ]
    },
    {
        id: 'belt',
        label: 'Belt',
        path: '/collection/belt',
        subs: [
            { id: 'leather-belt', label: 'Leather Belt', path: '/collection/leather-belt' }
        ]
    },
    {
        id: 'suspender',
        label: 'Suspender',
        path: '/collection/suspender',
        subs: [
            { id: 'suspender-sub', label: 'Suspender', path: '/collection/suspender' }
        ]
    },
    {
        id: 'cummerbund',
        label: 'Cummerbund',
        path: '/collection/cummerbund',
        subs: [
            { id: 'cummerbund-single', label: 'Cummerbund', path: '/collection/cummerbund' },
            { id: 'cummerbund-set', label: 'Cummerbund Set', path: '/collection/cummerbund-set' }
        ]
    }
];

export const getNavigationTree = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(NAVIGATION_TREE), 100);
    });
};
