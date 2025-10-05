import { useEffect, useState } from "react";
import { Text } from "tamagui";
import { supabase } from "src/services/supabase/supabaseClient";
import { ContentContainer } from "src/styled/container/ContentContainer";
import { SignIn } from "src/components/auth/signin/SignIn";
import { useAuth } from "src/AuthProvider";
import { BodyText } from "src/styled/text/BodyText";
import { PrimaryButton } from "src/styled/button/PrimaryButton";
import { signOut } from "src/services/supabase/supabaseAuthHelpers";

export default function App() {
  const { user, isLoading } = useAuth()

  console.log(user)

  return (
    <ContentContainer>
      {user ? (
        <>
          <BodyText>er logget ind </BodyText>
          <PrimaryButton onPress={signOut}>
            Sign out
          </PrimaryButton>
        </>
      ) : <SignIn />}
    </ContentContainer>
  );
}
