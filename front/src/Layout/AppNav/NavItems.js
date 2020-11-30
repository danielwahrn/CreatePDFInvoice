import Api from '../../Api';

let MainNav = [];
MainNav = [
    {
        icon: 'lnr-user',
        label: 'Contractors',
        to: '/dashboard/users'
    },
    {
        icon: 'lnr-book',
        label: 'Dockets',
        to: '/dashboard/dockets'
    },
    {
        icon: 'lnr-database',
        label: 'Tasks',
        to: '/dashboard/tasks'
    },    
    {
        icon: 'lnr-database',
        label: 'History',
        to: '/dashboard/history'
    },    
    {
        icon: 'lnr-highlight',
        label: 'Information',
        to: '/dashboard/information'
    }
]
export default MainNav;
