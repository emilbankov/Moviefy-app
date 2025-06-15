import { icons } from '@/constants/icons';
import { search } from '@/services/api';
import React, { useEffect, useState } from 'react';
import { Image, TextInput, View } from 'react-native';

interface Props {
    placeholder: string;
    onSearchResults?: (results: any[]) => void;
    onFocusChange?: (focused: boolean) => void;
}

const SearchBar = ({ placeholder, onSearchResults, onFocusChange }: Props) => {
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const performSearch = async () => {
            try {
                if (searchQuery.trim()) {
                    const response = await search(searchQuery);
                    console.log('Search results:', response);
                    if (response && response.results) {
                        onSearchResults?.(response.results);
                    } else {
                        onSearchResults?.([]);
                    }
                } else {
                    onSearchResults?.([]);
                }
            } catch (error) {
                console.error('Search error:', error);
                onSearchResults?.([]);
            }
        };

        const timeoutId = setTimeout(performSearch, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    return (
        <View className='flex-row items-center bg-dark-200 rounded-full px-5 py-4'>
            <Image source={icons.search} className='size-5' resizeMode='contain' tintColor="#ab8bff" />
            <TextInput
                placeholder={placeholder}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#a8b5db"
                className='flex-1 ml-2 text-white'
                onFocus={() => onFocusChange?.(true)}
                onBlur={() => onFocusChange?.(false)}
            />
        </View>
    )
}

export default SearchBar