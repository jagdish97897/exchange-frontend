import { useEffect } from 'react';
import { Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const DeepLinkHandler = () => {
    const navigation = useNavigation();

    useEffect(() => {
        const handleDeepLink = async (event) => {
            const url = event.url;
            const route = url.replace(/.*?:\/\//g, '');
            const query = route.split('?')[1];

            if (query && query.includes('contest=kgvlcontest')) {
                navigation.navigate('MultipleImageUpload');
            }
        };

        Linking.addEventListener('url', handleDeepLink);

        // Check if the app was opened with a deep link
        Linking.getInitialURL().then((url) => {
            if (url) {
                handleDeepLink({ url });
            }
        });

        return () => {
            Linking.removeEventListener('url', handleDeepLink);
        };
    }, [navigation]);

    return null; // This component only handles logic, doesn't render UI
};

export default DeepLinkHandler;
