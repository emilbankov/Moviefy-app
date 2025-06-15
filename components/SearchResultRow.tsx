import { icons } from '@/constants/icons';
import React from 'react';
import { Image, Text, View } from 'react-native';

interface Props {
    title: string;
    poster_path: string;
    vote_average: number;
    runtime: number | null;
    type: string;
    year?: number;
}

const SearchResultRow = ({ title, poster_path, vote_average, runtime, type, year }: Props) => {
    return (
        <View className='flex-row items-center p-3 border-b border-white/10'>
            <Image 
                source={{ uri: `https://image.tmdb.org/t/p/w500${poster_path}` }}
                className='w-16 h-24 rounded-lg'
                resizeMode='cover'
            />
            <View className='flex-1 ml-3'>
                <Text className='text-white text-base font-semibold' numberOfLines={1}>
                    {title}
                </Text>
                <View className='flex-row items-center mt-2'>
                    <View className='flex-row items-center bg-white/10 px-2 py-1 rounded-full'>
                        <Image 
                            source={icons.star} 
                            className='w-3 h-3 mr-1'
                            tintColor="#FFD700"
                        />
                        <Text className='text-white/90 text-xs'>{vote_average.toFixed(1)}</Text>
                    </View>
                    {runtime && (
                        <View className='flex-row items-center ml-2 bg-white/10 px-2 py-1 rounded-full'>
                            <Text className='text-white/90 text-xs'>{runtime} min</Text>
                        </View>
                    )}
                    <View className='flex-row items-center ml-2 bg-white/10 px-2 py-1 rounded-full'>
                        <Text className='text-white/90 text-xs capitalize'>{type}</Text>
                    </View>
                    {year && (
                        <View className='flex-row items-center ml-2 bg-white/10 px-2 py-1 rounded-full'>
                            <Text className='text-white/90 text-xs'>{year}</Text>
                        </View>
                    )}
                </View>
            </View>
        </View>
    )
}

export default SearchResultRow 