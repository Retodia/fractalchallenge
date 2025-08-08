import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export const SendIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.949a.75.75 0 00.95.544l4.285-1.285a.75.75 0 010 1.37l-4.285 1.286a.75.75 0 00-.95.544l-1.414 4.95a.75.75 0 00.826.95l14.896-4.469a.75.75 0 000-1.416L3.105 2.289z" />
  </svg>
);

export const UserIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z" clipRule="evenodd" />
  </svg>
);

export const SparklesIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.393c-.842.07-1.168 1.063-.57 1.616l3.57 3.218-1.06 4.635c-.19.825.717 1.459 1.441 1.061l4.13-2.428 4.132 2.428c.724.398 1.63-.236 1.441-1.06l-1.06-4.635 3.57-3.218c.598-.553.272-1.547-.57-1.616l-4.753-.393-1.83-4.401z" clipRule="evenodd" />
  </svg>
);

export const AtomIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.01 9.01 0 0 0 9-9h-9v9ZM12 3a9.01 9.01 0 0 0-9 9h9V3Zm0 0a9.01 9.01 0 0 1 9 9h-9V3Zm0 0a9.01 9.01 0 0 0-9 9h9V3Zm0 18a9.01 9.01 0 0 1-9-9h9v9Z" />
        <path d="M12 12a2 2 0 11-4 0 2 2 0 014 0z" fill="currentColor" />
    </svg>
);

export const GridIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.5-6h15m-15-6h15" />
    </svg>
);

export const CogIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75v4.5m-4.5-2.25h9" />
    </svg>
);

export const GoogleIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" {...props} fill="none">
        <path fill="#4285F4" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
        <path fill="#34A853" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8V36c6.627 0 12-5.373 12-12c0-1.341-.138-2.65-.389-3.917z" />
        <path fill="#FBBC05" d="M24 4c-5.268 0-10.046 2.053-13.483 5.483l5.657 5.657C18.158 13.154 20.941 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4z" />
        <path fill="#EA4335" d="M4 24c0 5.268 2.053 10.046 5.483 13.483l5.657-5.657C13.154 29.842 12 27.059 12 24s1.154-5.842 3.134-7.961L9.483 10.38C6.053 13.817 4 18.595 4 24z" />
        <path fill="none" d="M4 4h40v40H4z" />
    </svg>
);

export const AppleIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M19.334 14.394s-.328 1.48-1.503 2.656c-1.259 1.259-2.222 1.34-2.83.993-.056-.032-.516-.279-1.258-.279-.728 0-1.214.28-1.748.28-.533 0-1.303-.292-1.92-.292-.617 0-1.275.292-1.895.292-.616 0-1.04-.266-1.637-.266s-1.353.28-1.886.28c-.534 0-1.146-.3-1.69-.3-.544 0-.98.266-1.28.266l-.01.01c-.812 0-1.747-.532-2.39-1.467C.56 15.34.027 13.23 0 11.23c0-2.362 1.08-3.79 2.52-4.81C3.597 5.69 4.67 5.03 6.138 5.03c.532 0 1.257.292 1.83.292.574 0 1.147-.292 1.829-.292.683 0 1.258.267 1.704.267.445 0 .993-.267 1.76-.267.766 0 1.246.267 1.69.267.445 0 1.134-.336 1.841-.336.708 0 1.954.586 2.656 1.583-.178.106-.994.573-1.272 1.48-.445 1.467.587 2.221 1.34 2.378.337.07.728.167 1.258.07.135-.023.27-.056.39-.092.083-.024.18-.05.28-.083.085-.024.155-.05.24-.076l.042-.014c.4-.146.47-.94.493-1.127.01-.08.01-.133.01-.166l-.01-.178c-.01-.157.105-.335.127-.36s.255-.1.543-.056c.288.043.5.156.556.177l.044.012s-.653 2.165-2.232 3.193zM15.42 4.414c.837-.994 1.456-2.31 1.293-3.68-.994.043-2.152.696-2.976 1.69-.767.925-1.516 2.333-1.342 3.636.994-.01 2.188-.654 3.025-1.646z"/>
    </svg>
);

export const PlayIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
  </svg>
);

export const PauseIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
  </svg>
);

export const CheckCircleIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const PencilIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);

export const TrashIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.124-2.033-2.124H8.033c-1.12 0-2.033.944-2.033 2.124v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

export const PlusCircleIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);