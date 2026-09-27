/**
 * The Living Hearth - Multi-Client Sovereign Sync Engine
 * Real-time tab-to-tab & window-to-window synchronization via standard BroadcastChannel API.
 * 
 * Provides instantaneous, peer-like local updates without commercial WebSockets,
 * ad telemetry, or third-party servers.
 */

import type { RoomMessage, PrayerIntention, PrayerResponse } from '../types';

export type SyncPayload =
  | { type: 'ROOM_MESSAGE'; roomId: string; message: RoomMessage }
  | { type: 'PRAYER_INTENTION'; prayer: PrayerIntention }
  | { type: 'PRAYER_RESPONSE'; prayerId: string; response: PrayerResponse }
  | { type: 'PRESENCE_PING'; senderHandle: string; currentTab: string; activeRoomId: string | null }
  | { type: 'VAULT_STATUS_CHANGE'; isUnlocked: boolean; mode: string };

type SyncListener = (payload: SyncPayload) => void;

class BroadcastSyncEngine {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<SyncListener> = new Set();
  private channelName = 'living_hearth_sanctuary_sync_v1';
  private tabId: string;

  constructor() {
    this.tabId = `tab-${Math.random().toString(36).substring(2, 9)}`;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(this.channelName);
        this.channel.onmessage = (event: MessageEvent<SyncPayload>) => {
          this.notifyListeners(event.data);
        };
      } catch (e) {
        console.warn('BroadcastChannel initialization failed, fallback active', e);
      }
    }
  }

  /**
   * Broadcast an event to all other open tabs/windows
   */
  public broadcast(payload: SyncPayload): void {
    if (this.channel) {
      try {
        this.channel.postMessage(payload);
      } catch (err) {
        console.warn('Failed to broadcast sync message', err);
      }
    }
  }

  /**
   * Register a listener for incoming multi-client sync events
   */
  public subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(payload: SyncPayload): void {
    this.listeners.forEach((listener) => {
      try {
        listener(payload);
      } catch (err) {
        console.error('Error in sync listener', err);
      }
    });
  }

  public getTabId(): string {
    return this.tabId;
  }
}

export const syncEngine = new BroadcastSyncEngine();
