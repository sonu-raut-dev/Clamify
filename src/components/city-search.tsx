import React, { useState } from 'react'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from './ui/command'
import { Button } from './ui/button';
import { Clock, Loader2, SearchIcon, XCircleIcon } from 'lucide-react';
import { useSearchLocationQuery } from '@/hooks/use-weather';
import { useNavigate } from 'react-router-dom';
import { useSearchHistory } from '@/hooks/use-search-history';
import { format } from 'date-fns';

const CitySearch = () => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const {data:locations,isLoading} =useSearchLocationQuery(query);
    const navigate = useNavigate();

    const {history,clearHistory,addToHistory} = useSearchHistory()

    const handleSelect = (cityData: string) => {
        const [lat, lon, name, country] = cityData.split('|');

        addToHistory.mutate({
            query,
            name,
            lat: parseFloat(lat),
            lon: parseFloat(lon),
            country,
        })

        setOpen(false);
        navigate(`/city/${name}/?lat=${lat}&lon=${lon}`);
    }
  return (
    <>
    <Button variant="outline" onClick={() => setOpen(true)}
        className='relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64'    
    >
        <SearchIcon className='mr-2 h-4 w-4' />
        Search City
    </Button>
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput 
        placeholder='Search cites'
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {query.length > 2 && !isLoading && <CommandEmpty>No results found.</CommandEmpty>}
        <CommandGroup heading="Favorites">
          <CommandItem>Favorites</CommandItem>
        </CommandGroup>
        {history.length > 0 &&  (
            <>
                <CommandSeparator />
                <CommandGroup>
                    <div className='flex items-center justify-between px-2 my-2'>
                        <p className='text-sm text-muted-foreground'>Recent Searches</p>
                        <Button
                            variant={'ghost'}
                            size={'sm'}
                            onClick={() => clearHistory.mutate()}
                        >
                            <XCircleIcon className='h-4 w-4 mr-2' />
                            Clear
                        </Button>
                    </div>
                    {history.map((item) => {
                        return (
                            <CommandItem
                                key={item.id}
                                value={`${item.lat}|${item.lon}|${item.name}|${item.country}`}
                                onSelect={handleSelect}
                            >
                                <Clock className='w-4 h-4 mr-2 text-muted-foreground' />
                                <span>{item.name}</span>
                                {item.state && <span className='text-sm text-muted-foreground'>, {item.state}</span>}
                                <span className='text-sm text-muted-foreground'>, {item.country}</span>
                                <span className='ml-auto text-xs text-muted-foreground'>{format(item.searchedAt,"MMM d,h:mm a")}</span>
                            </CommandItem>
                        )
                    })}
                </CommandGroup>
            </>
        )}
        <CommandSeparator />
        {locations && locations.length > 0 && (
          <CommandGroup heading="Suggestions">
            {isLoading && (
                <div className='flex justify-center items-center p-4'>
                    <Loader2 className='h-4 w-4 animate-spin'/>
                </div>
            )}
            {locations.map((location) => {
                return(
                    <CommandItem
                        key={`${location.lat}-${location.lon}`}
                        value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                        onSelect={handleSelect}
                    >
                        <SearchIcon className='w-4 h-4 mr-2' />
                        <span>{location.name}</span>
                        {location.state && <span className='text-sm text-muted-foreground'>, {location.state}</span>}
                        <span className='text-sm text-muted-foreground'>, {location.country}</span>
                    </CommandItem>
                )
            })}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
    </>
  )
}

export default CitySearch 