import type { NextPage } from "next";
import Head from "next/head";

import { Userform } from "../components/userform.component";

const ProfilePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <div className="content">
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 600,
            marginBottom: "1rem",
            textAlign: "center",
          }}
        >
          update your profile
        </h1>
        <div>
          <Userform />
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
