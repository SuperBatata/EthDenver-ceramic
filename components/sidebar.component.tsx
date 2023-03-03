import Image from "next/image";
import Link from "next/link";
import ceramicLogo from "../public/ceramicLogo.png";

import { FaHome, FaUser, FaHashtag } from "react-icons/fa";
import { SidebarProps } from "../types";

export const Sidebar = ({ hundle, username, id }: SidebarProps) => {
  return (
    <div
      className="top"
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        justifyContent: "center",
        color: "black",
      }}
    >
      <Link href={`/profile`}>
        <a
          style={{
            fontSize: "2rem",
            fontWeight: 600,
            margin: "1rem",
            textAlign: "center",
          }}
        >
          Profile
        </a>
      </Link>
      <Link href={`/`}>
        <a
          style={{
            fontSize: "2rem",
            fontWeight: 600,
            margin: "1rem",
            textAlign: "center",
          }}
        >
          Home
        </a>
      </Link>
    </div>
  );
};
