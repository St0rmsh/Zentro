import { axiosInstance } from "@/shared/lib/axios";

interface QueuedRequest {
  id: string;
  url: string;
  method: string;
  data?: any;
  headers?: any;
}

const QUEUE_KEY = "zentro_offline_queue";

class OfflineService {
  private getQueue(): QueuedRequest[] {
    if (typeof window === "undefined") return [];
    const queue = localStorage.getItem(QUEUE_KEY);
    return queue ? JSON.parse(queue) : [];
  }

  private setQueue(queue: QueuedRequest[]) {
    if (typeof window !== "undefined") {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    }
  }

  public enqueueRequest(request: Omit<QueuedRequest, "id">) {
    const queue = this.getQueue();
    const newRequest: QueuedRequest = {
      ...request,
      id: crypto.randomUUID(),
    };
    queue.push(newRequest);
    this.setQueue(queue);
    
    // Dispatch event so UI can update (e.g., OfflineBanner showing unsynced changes)
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("offline_queue_updated", { detail: queue.length }));
    }
  }

  public async processQueue() {
    if (!navigator.onLine) return;

    const queue = this.getQueue();
    if (queue.length === 0) return;

    console.log(`Processing offline queue with ${queue.length} items...`);
    
    const remainingQueue: QueuedRequest[] = [];

    for (const req of queue) {
      try {
        await axiosInstance({
          url: req.url,
          method: req.method,
          data: req.data,
          headers: req.headers,
        });
        console.log(`Successfully processed offline request: ${req.url}`);
      } catch (error) {
        console.error(`Failed to process offline request: ${req.url}`, error);
        // Put back in queue if it wasn't a 4xx error (meaning it's likely a persistent issue)
        // For simplicity, we just put it back for now
        remainingQueue.push(req);
      }
    }

    this.setQueue(remainingQueue);
    
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("offline_queue_updated", { detail: remainingQueue.length }));
    }
  }
  
  public getQueueLength(): number {
    return this.getQueue().length;
  }
}

export const offlineService = new OfflineService();
