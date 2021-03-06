import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

export default function Home(): JSX.Element {
  const fetchImages = ({ pageParam = null }) => {
    const result = api.get('images', {
      params: {
        after: pageParam,
      },
    });
    return result;
  };

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', fetchImages, {
    getNextPageParam: (lastPage: any) => {
      return !!lastPage?.data?.after ? lastPage.data.after : undefined;
    },
  });

  const formattedData = useMemo(() => {
    // TODO FORMAT AND FLAT DATA ARRAY
    return data?.pages.map(p => p.data.data).flat();
  }, [data]);

  // TODO RENDER LOADING SCREEN
  if (isLoading) {
    return <Loading />;
  }

  // TODO RENDER ERROR SCREEN
  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />

        {
          /* TODO RENDER LOAD MORE BUTTON IF DATA HAS NEXT PAGE */

          hasNextPage && (
            <Button
              mt={4}
              onClick={() =>
                isFetchingNextPage
                  ? console.log('isFetchingNextPage')
                  : fetchNextPage()
              }
            >
              {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
            </Button>
          )
        }
      </Box>
    </>
  );
}
