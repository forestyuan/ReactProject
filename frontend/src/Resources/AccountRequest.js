import { Resource } from './Resource';

export const AccountRequestResource = new Resource({
  find: {
    method: Resource.GET,
    url: '/:accountRequestId'
  },
  findByPublicKey: {
    method: Resource.GET,
    url: '/publicKey/:publicKey'
  },
  findByAccountName: {
    method: Resource.GET,
    url: '/accountName/:accountName'
  },
  create: {
    method: Resource.POST,
    url: '/create'
  },
  setCreated: {
    method: Resource.PUT,
    url: '/status/created',
  },
  checkout: {
    method: Resource.POST,
    url: '/checkout'
  },
  shareToFriend: {
    method: Resource.POST,
    url: '/share/email'
  },
}, {base: 'account_request'});
