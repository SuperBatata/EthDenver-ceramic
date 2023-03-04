import { useState, useEffect } from "react";
import { authenticateCeramic } from "../utils";
import { useCeramicContext } from "../context";
import axios from "axios";
import { Profile } from "../types";

import styles from "@/styles/profile.module.scss";

export const Userform = () => {
  const clients = useCeramicContext();
  const { ceramic, composeClient } = clients;

  const [profile, setProfile] = useState<Profile | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [twitter_handle, setTwitter_handle] = useState<string>("");
  const [discord_handle, setDiscord_handle] = useState<string>("");
  const [telegram_handle, setTelegram_handle] = useState<string>("");
  const [vc, setVc] = useState<string>("");

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
      id
      name
      email
      twitter_handle
      discord_handle
      telegram_handle
      vc
    }
    isViewer
  }
}      `);
      console.log("thisprofile", profile);

      setProfile(profile?.data?.viewer?.userProfile);
      setName(profile?.data?.viewer?.userProfile?.name);
      setEmail(profile?.data?.viewer?.userProfile?.email);
      setTwitter_handle(profile?.data?.viewer?.userProfile?.twitter_handle);
      setDiscord_handle(profile?.data?.viewer?.userProfile?.discord_handle);
      setTelegram_handle(profile?.data?.viewer?.userProfile?.telegram_handle);
    }
  };

  const generateVC = async () => {
    const did = ceramic.did?.id;
    console.log("haaadid", did);
    const res = await axios
      .post(
        "https://signatory.ssikit.walt.id/v1/credentials/issue",
        {
          templateId: "VerifiableId",
          config: {
            issuerDid:
              "did:key:z6MkuUjqQWMdisCbvmbPZLnJ3XQ8tLLauxMSaX5myq5as2oL",
            subjectDid: did,
            proofType: "JWT",
          },
          credentialData: {
            credentialSubject: {
              twitterHandle: `${profile?.twitter_handle}`,
              discordHandle: `${profile?.discord_handle}`,
              telegramHandle: `${profile?.telegram_handle}`,
              email: `${profile?.email}`,
              name: `${profile?.name}`,
            },
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.status === 200 && ceramic.did !== undefined) {
          console.log(res.data);
          const vc = res.data;
          setVc(vc);
        }
      });
  };

  const updateProfile = async () => {
    setLoading(true);

    await generateVC();

    console.log("vc", vc);
    if (ceramic.did !== undefined) {
      const update = await composeClient.executeQuery(`
        mutation {
          createuserProfile(input: {
            content: {
                name: "${profile?.name}"
                email: "${profile?.email}"
                twitter_handle: "${profile?.twitter_handle}"
                discord_handle: "${profile?.discord_handle}"
                telegram_handle: "${profile?.telegram_handle}"
                vc: "${vc}"

            }
          })
          {
            document {

              name
              email
              twitter_handle
              discord_handle
              telegram_handle
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
              <label className="">name</label>
              <input
                className=""
                type="text"
                defaultValue={profile?.name || ""}
                onChange={(e) => {
                  setProfile({ ...profile, name: e.target.value });
                }}
              />
            </div>
            <div className="">
              <label> email </label>
              <input
                type="text"
                defaultValue={profile?.email || ""}
                onChange={(e) => {
                  setProfile({ ...profile, email: e.target.value });
                }}
              />
            </div>
            <div className="">
              <label>twitter handle</label>
              <input
                type="text"
                defaultValue={profile?.twitter_handle || ""}
                onChange={(e) => {
                  setProfile({ ...profile, twitter_handle: e.target.value });
                }}
              />
            </div>
            <div className="">
              <label>discord handle</label>
              <input
                type="text"
                defaultValue={profile?.discord_handle || ""}
                onChange={(e) => {
                  setProfile({ ...profile, discord_handle: e.target.value });
                }}
              />
            </div>

            <div className="">
              <label>telegram handle</label>
              <input
                type="text"
                defaultValue={profile?.telegram_handle || ""}
                onChange={(e) => {
                  setProfile({ ...profile, telegram_handle: e.target.value });
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
              <button
                onClick={() => {
                  generateVC();
                }}
                style={{
                  width: "90px",
                  height: "50px",
                  margin: "10px",
                }}
              >
                Generate VC
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
        <p>Name: {profile?.name}</p>
        <p>Email: {profile?.email}</p>
        <p>Twitter: {profile?.twitter_handle}</p>
        <p>Discord: {profile?.discord_handle}</p>
        <p>Telegram: {profile?.telegram_handle}</p>
      </div>
    </>
  );
};
