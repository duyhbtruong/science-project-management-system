"use client";

import { ClientSideSuspense } from "@liveblocks/react";
import { shallow, useOthers, useSelf } from "@liveblocks/react/suspense";

const AVATAR_SIZE = 36;

export const Avatars = () => {
  return (
    <ClientSideSuspense fallback={null}>
      <AvatarStack />
    </ClientSideSuspense>
  );
};

const AvatarStack = () => {
  const users = useOthers();
  const currentUser = useSelf();

  if (users.length === 0) return null;

  return (
    <>
      <div className="h-6 bg-gray-300 w-[1px]" />
      <div className="flex items-center">
        {currentUser && (
          <div className="relative ml-2">
            <Avatar
              src={currentUser.info.avatar}
              name={currentUser.info.name}
            />
          </div>
        )}
        <div className="flex">
          {users.map(({ connectionId, info }) => {
            return (
              <Avatar key={connectionId} src={info.avatar} name={info.name} />
            );
          })}
        </div>
      </div>
    </>
  );
};

const LetterAvatar = ({ name, size = AVATAR_SIZE }) => {
  const letter = name ? name.charAt(0).toUpperCase() : "?";

  const getColor = (str) => {
    const nameToNumber = str
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = Math.abs(nameToNumber) % 360;
    return `hsl(${hue}, 80%, 60%)`;
  };

  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: getColor(name),
        color: "white",
        fontSize: `${size * 0.4}px`,
      }}
      className="relative flex items-center justify-center -ml-2 border-4 border-white rounded-full group shrink-0"
    >
      {letter}
    </div>
  );
};

const Avatar = ({ src, name }) => {
  if (!src) {
    return <LetterAvatar name={name} />;
  }

  return (
    <div
      style={{
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
      }}
      className="relative flex -ml-2 bg-gray-400 border-4 border-white rounded-full group shrink-0 place-content-center"
    >
      <div className="opacity-0 group-hover:opacity-100 absolute top-full py-1 px-2 text-white text-xs rounded-lg mt-2.5 z=10 bg-black whitespace-nowrap transition-opacity">
        {name}
      </div>
      <img alt={name} src={src} className="rounded-full size-full" />
    </div>
  );
};
