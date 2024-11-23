import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Branch from 'react-native-branch';
import { Alert } from 'react-native';
import { setReferralCode } from './features/auth/authSlice';

export default function ReferralHandler() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Subscribe to Branch deep links
    const unsubscribe = Branch.subscribe(({ error, params }) => {
      if (error) {
        console.error('Branch deep link error:', error);
        return;
      }

      if (params['+clicked_branch_link']) {
        // Extract referralCode from the Branch link's custom parameters
        const referralCode = params.referralCode;
        Alert.alert('Referral Code:', referralCode);

        if (referralCode) {
          // Save the referral code to Redux store
          dispatch(setReferralCode(referralCode));

          // Optionally navigate to a referral screen, make sure to use `navigationRef`
          // navigationRef.navigate('ReferralPage', { referralCode });
        }
      }
    });

    // Clean up subscription on component unmount
    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  return null; // No UI needed for this component
}
