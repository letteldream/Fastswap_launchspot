import { useSelector } from 'react-redux'
import { AppState } from '../index';
import { doCheckAdmin } from './actions';

export function useCheckedAdmin(): boolean {
  return useSelector((state: AppState) => state.admins.logined)
}

export function handleCheckAdmin({ logined }) {
  return doCheckAdmin(logined)
}