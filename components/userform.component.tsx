import { useState, useEffect } from "react";
import { authenticateCeramic } from "../utils";
import { useCeramicContext } from "../context";

import { Profile } from "../types";

import styles from "@/styles/profile.module.scss";

export const Userform = () => {
  const clients = useCeramicContext();
  const { ceramic, composeClient } = clients;

  const [profile, setProfile] = useState<Profile | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [hundle, setHundle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleLogin = async () => {
    await authenticateCeramic(ceramic, composeClient);
    await getProfile();
  };

  const getProfile = async () => {
    if (ceramic.did !== undefined) {
      const profile = await composeClient.executeQuery(`

query  {
  viewer {
    userProfile {
      description
      hundle
      username
    }
    isViewer
  }
}      `);
      console.log("thisprofile", profile);
      setUsername(profile?.data?.userProfileIndex?.edges[0]?.node?.username);
      setHundle(profile?.data?.userProfileIndex?.edges[0]?.node?.hundle);
      setDescription(
        profile?.data?.userProfileIndex?.edges[0]?.node?.description
      );
      console.log(username, hundle, description);
      setProfile(profile?.data?.viewer?.userProfile);
    }
  };

  const updateProfile = async () => {
    setLoading(true);
    if (ceramic.did !== undefined) {
      const update = await composeClient.executeQuery(`
        mutation {
          createuserProfile(input: {
            content: {
                username: "${profile?.username}"
                description: "${profile?.description}"
                hundle: "${profile?.hundle}"
           
            }
          }) 
          {
            document {
             
              username
              description
              hundle
            }
          }
        }
      `);
      console.log(update);
      await getProfile();
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <>
      {profile === undefined && ceramic.did === undefined ? (
        <div className="content">
          <button
            onClick={() => {
              handleLogin();
            }}
          >
            Login
          </button>
        </div>
      ) : (
        <div className="content">
          <div className={styles.formGroup}>
            <div className="">
              <label className="">handler</label>
              <input
                className=""
                type="text"
                defaultValue={profile?.hundle || ""}
                onChange={(e) => {
                  setProfile({ ...profile, hundle: e.target.value });
                }}
              />
            </div>
            <div className="">
              <label>Username (at least 6 characters) </label>
              <input
                type="text"
                defaultValue={profile?.username || ""}
                onChange={(e) => {
                  setProfile({ ...profile, username: e.target.value });
                }}
              />
            </div>
            <div className="">
              <label>Description</label>
              <input
                type="text"
                defaultValue={profile?.description || ""}
                onChange={(e) => {
                  setProfile({ ...profile, description: e.target.value });
                }}
              />
            </div>

            <div className="">
              <button
                onClick={() => {
                  updateProfile();
                }}
                style={{
                  width: "90px",
                  height: "50px",
                  margin: "10px",
                }}
              >
                {loading ? "Loading..." : "Update Profile"}
              </button>
              <button
                onClick={() => {
                  getProfile();
                }}
                style={{
                  width: "90px",
                  height: "50px",
                  margin: "10px",
                }}
              >
                {loading ? "Loading..." : "get Profile"}
              </button>
            </div>
          </div>
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "white",
          color: "black",
          fontSize: "1.5rem",
          fontWeight: 600,
          padding: "1rem",
          borderRadius: "0.5rem",
          boxShadow: "0 0 0.5rem 0.5rem rgba(0, 0, 0, 0.1)",
          margin: "1rem",
        }}
      >
        <h1>Profile Data</h1>
        <p>handle: {profile?.hundle}</p>
        <p>Username: {profile?.username}</p>
        <p>Description: {profile?.description}</p>
      </div>
    </>
  );
};
