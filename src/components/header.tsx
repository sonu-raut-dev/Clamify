import { useTheme } from '@/context/theme-provider'
import { Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom'
import CitySearch from './city-search';

const Header = () => {
   const {theme,setTheme} = useTheme();
   const isDark = theme === 'dark';
  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur py-2 supports-backdrop-filter:bg-background/60'>
        <div className='container mx-auto flex h-18 items-center justify-between px-4'>
            <Link to={'/'}>
                <img src="/clamify-logo.png" alt="Clamify Logo" className="h-20 w-auto" />
            </Link>
            <div className='flex gap-4'>
                {/* Search */}
                <CitySearch />
                <div onClick={() => setTheme(isDark? 'light' : 'dark')}
                    className={`flex items-center justify-center ${isDark ? "rotate-180" : "rotate-0" } duration-500 transition-all`}
                >
                    {isDark ? 
                        <Sun className='h-6 w-6 cursor-pointer rotate-0 transition-all text-yellow-500' />
                    :
                        <Moon className='h-6 w-6 cursor-pointer rotate-0 transition-all text-blue-500' />
                    }
                </div>
            </div>
        </div>
    </header>
  )
}

export default Header