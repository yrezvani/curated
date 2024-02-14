import React, { useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useNavigate, useLocation } from 'react-router-dom';


function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}


export default function NavBar() {
  const [searchQuery, setSearchQuery] = useState('');

  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const navigate = useNavigate();

  const location = useLocation();


  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const navigation = [
    { name: 'Home', href: '/', current: location.pathname === '/' },
    { name: 'Explorer', href: '/explorer', current: location.pathname === '/explorer' },
    { name: 'My Gallery', href: '/my-gallery', current: location.pathname === '/my-gallery' },
    { name: 'Search', href: '/search', current: location.pathname.startsWith('/search') },
    { name: 'Contact', href: '/contact', current: location.pathname === '/contact' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowMobileSearch(false);
    }
  };

  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
  };

  
  return (
  <Disclosure as="nav" className="bg-gray-800">
    {({ open }) => (
      <>
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              {/* Mobile menu button*/}
              <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="sr-only">Open main menu</span>
                {open ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </Disclosure.Button>
              {/* Mobile search button */}
              <button
                className="ml-3 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                onClick={toggleMobileSearch}
              >
                <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
                <span className="sr-only">Search</span>
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex-shrink-0 flex items-center">
                <a href="/">
                  <h2 className="text-xl font-heading leading-7 text-white lg:truncate lg:text-2xl lg:tracking-tight">
                    CRTD
                  </h2>
                </a>
              </div>
              <div className="hidden sm:block sm:ml-6">
                <div className="flex space-x-4">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'px-3 py-2 rounded-md text-sm font-medium'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <form onSubmit={handleSubmit} className="hidden sm:flex">
                <input
                  type="search"
                  className="w-full px-3 py-2 leading-5 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                  placeholder="Search by Art name"
                  aria-label="Search"
                  value={searchQuery}
                  onChange={handleInputChange}
                />
                <button
                  type="submit"
                  className="p-2 text-white bg-transparent rounded-md"
                >
                  <MagnifyingGlassIcon className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>        {showMobileSearch && (
          <div className="px-4 pb-3 pt-2 sm:hidden">
            <form onSubmit={handleSubmit} className="flex">
              <input
                type="search"
                className="flex-1 block w-full rounded-md border border-gray-300 pl-4 pr-10 py-2 leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Search by Art name"
                value={searchQuery}
                onChange={handleInputChange}
              />
              <button
                type="submit"
                className="ml-3 flex-shrink-0 bg-blue-500 p-2 text-white rounded-md"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </form>
          </div>
        )}        <Disclosure.Panel className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Disclosure.Button
                key={item.name}
                as="a"
                href={item.href}
                className={classNames(
                  item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'block px-3 py-2 rounded-md text-base font-medium'
                )}
                aria-current={item.current ? 'page' : undefined}
              >
                {item.name}
              </Disclosure.Button>
            ))}
          </div>
        </Disclosure.Panel>
      </>
    )}
  </Disclosure>
);}