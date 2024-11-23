import React, { useState } from "react";
import { SafeAreaView, View, Text, Image } from "react-native";
import { Button } from 'react-native-elements';
import { SwipeButton } from 'react-native-expo-swipe-button';
import { styled } from "nativewind";

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);

export default ({ navigation }) => {
    const [check, setCheck] = useState(-1);

    return (
        <StyledSafeAreaView className="flex-1 justify-evenly items-center bg-white">
            <StyledView className="items-center">
                <StyledImage 
                    source={require("../assets/images/loginuper.png")} 
                    style={{ width: 100, height: 100 }} 
                    className="mb-4"
                />
                 <StyledText style={{ textAlign: 'center', fontWeight: 'bold' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</StyledText>
                <Button
                    title="Consumer"
                    buttonStyle={{
                        backgroundColor: '#4A90E2',
                        borderRadius: 20,
                        marginTop: 20,
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                    }}
                    titleStyle={{ fontSize: 16 }}
                    onPress={() => setCheck(0)}
                />
            </StyledView>

            <SwipeButton
                title={`Swipe to complete for ${check === 0 ? "Consumer" : 'VSP'}`}
                borderRadius={180}
                onComplete={() => navigation.navigate(check === 0 ? 'RegisterCons' : 'RegisterVsp')}
                containerStyle={{ backgroundColor: '#A9CBF4' }}
                underlayTitle="Release to complete"
                underlayTitleStyle={{ color: 'black' }}
                disabled={check === -1}
            />

            <StyledView className="items-center">
                <StyledImage 
                    source={require("../assets/images/loginbottom.png")} 
                    style={{ width: 100, height: 100 }} 
                    className="mb-4"
                />
              
                <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
  </Text>
                <Button
                    title="VSP"
                    buttonStyle={{
                        backgroundColor: '#E74C3C',
                        borderRadius: 20,
                        marginTop: 20,
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                    }}
                    titleStyle={{ fontSize: 16 }}
                    onPress={() => setCheck(1)}
                />
            </StyledView>
        </StyledSafeAreaView>
    );
};
