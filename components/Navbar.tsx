import Image from 'next/image'
import Link from 'next/link'

const navIcons = [
    {
        src: '/assets/icons/search.svg',
        alt: 'Search'
    },
    {
        src: '/assets/icons/black-heart.svg',
        alt: 'Wishlist'
    },
    {
        src: '/assets/icons/user.svg',
        alt: 'Profile'
    }
]

const Navbar = () => {
    return (
        <header className='w-full'>
            <nav className='nav'>
                <Link href={'/'} className='flex items-center gap-1'>
                    <p className="nav-logo">
                        Spy <span className="text-primary">Price</span>
                    </p>
                    <Image
                        src={'/assets/icons/logo.svg'}
                        alt='Logo'
                        width={27}
                        height={27}
                    />
                </Link>
                <div className="flex items-center gap-5">
                    {navIcons.map(icon => (
                        <Image
                            src={icon.src}
                            alt={icon.alt}
                            key={icon.alt}
                            width={28}
                            height={28}
                            className='object-contain hover:border-b-2 transition-all duration-300 ease-in-out border-white border-b-2 hover:border-primary cursor-pointer'
                        />
                    ))}
                </div>
            </nav>
        </header>
    )
}

export default Navbar