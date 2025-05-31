import MovieCard from '@/components/MovieCard'
import { images } from '@/constants/images'
import { getPopularMovies, search } from '@/services/api'
import React, { useEffect, useState } from 'react'
import { FlatList, Image, View } from 'react-native'


const Search = () => {
    const [movies, setMovies] = useState<TrendingMovies[]>([]);

    useEffect(() => {
        const fetchMovies = async () => {
            const response = await search();
            console.log(response.movies);
            setMovies(response.movies);
        };
        fetchMovies();
    }, []);

    return (
        <View className='flex-1 bg-primary'>
            <Image source={images.bg} className='flex-1 absolute w-full z-0' resizeMode='cover' />
            <FlatList
                data={movies}
                renderItem={({ item }) => (<MovieCard {...item} />)}
            />
        </View>
    )
}

export default Search