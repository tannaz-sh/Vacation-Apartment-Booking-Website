import type { Access } from 'payload';

export const isAdmin: Access = ({ req }) => req.user?.collection === 'admins';
export const publishedOrAdmin: Access = ({ req }) =>
  req.user?.collection === 'admins' ? true : { _status: { equals: 'published' } };
