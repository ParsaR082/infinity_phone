import React from 'react';

export default function LazyImage({
  src,
  alt = '',
  className = '',
  imgClassName = '',
  priority = false,
  ...props
}) {
  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={`${imgClassName || className}`}
      {...props}
    />
  );
}
