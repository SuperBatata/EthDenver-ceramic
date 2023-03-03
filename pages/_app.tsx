import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { CeramicWrapper } from "../context";
import { useState, useEffect } from "react";
import { useCeramicContext } from "../context";
import { authenticateCeramic } from "../utils";

type Profile = {
  id?: any;
  username?: string;
  description?: string;
  hundle?: string;
};

export default function App({ Component, pageProps }: AppProps) {
  const clients = useCeramicContext();
  const { ceramic, composeClient } = clients;
  const [profile, setProfile] = useState<Profile | undefined>();
  const handleLogin = async () => {
    await authenticateCeramic(ceramic, composeClient);
    await getProfile();
  };
  const getProfile = async () => {
    if (ceramic.did !== undefined) {
      const profile = await composeClient.executeQuery(`
        query {
          viewer {
            id
            userProfile {
              id
              username
            }
          }
        }
      `);
      localStorage.setItem("viewer", profile?.data?.viewer?.id);

      setProfile(profile?.data?.viewer?.userProfile);
    }
  };
  useEffect(() => {
    if (localStorage.getItem("did")) {
      handleLogin();
      getProfile();
    } else {
      handleLogin();
    }
  }, []);

  return (
    <div className="container">
      <CeramicWrapper>
        <Sidebar
          name={profile?.name}
          username={profile?.username}
          id={profile?.id}
        />
        <div className="body">
          <Component {...pageProps} ceramic />
          <Footer />
        </div>
      </CeramicWrapper>
    </div>
  );
}

