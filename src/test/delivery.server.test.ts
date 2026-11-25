import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getShopAssets: vi.fn(),
  getShopOrder: vi.fn(),
  r2Head: vi.fn(),
  r2Get: vi.fn(),
}));

vi.mock("@/lib/shop-db.server", () => ({
  getShopAssets: mocks.getShopAssets,
  getShopOrder: mocks.getShopOrder,
  shopEnv: {
    AUDIO_R2: {
      head: mocks.r2Head,
      get: mocks.r2Get,
    },
    AUDIO_KV: {
      list: vi.fn(),
      get: vi.fn(),
    },
  },
}));

import { servePaidOrderDownload } from "@/lib/delivery.server";

const orderId = "123e4567-e89b-42d3-a456-426614174000";
const upc = "199951252436";
const objectKey = "18 master/199951252436/test-medley.wav";

function minimalPcmWav(): Uint8Array {
  const bytes = new Uint8Array(44);
  const view = new DataView(bytes.buffer);
  bytes.set(new TextEncoder().encode("RIFF"), 0);
  view.setUint32(4, 36, true);
  bytes.set(new TextEncoder().encode("WAVE"), 8);
  bytes.set(new TextEncoder().encode("fmt "), 12);
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 2, true);
  view.setUint32(24, 44100, true);
  view.setUint32(28, 176400, true);
  view.setUint16(32, 4, true);
  view.setUint16(34, 16, true);
  bytes.set(new TextEncoder().encode("data"), 36);
  view.setUint32(40, 0, true);
  return bytes;
}

describe("paid WAV delivery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("blocks a pending order before reading any audio assets", async () => {
    mocks.getShopOrder.mockResolvedValue({
      id: orderId,
      release_upc: upc,
      status: "pending",
    });

    const response = await servePaidOrderDownload(
      new Request(`https://nflt-records.com/api/download?order=${orderId}`),
    );

    expect(response.status).toBe(403);
    expect(await response.text()).toBe("Paiement non confirmé");
    expect(mocks.getShopAssets).not.toHaveBeenCalled();
    expect(mocks.r2Get).not.toHaveBeenCalled();
  });

  it("does not substitute a complete M4A source for missing WAV masters", async () => {
    mocks.getShopOrder.mockResolvedValue({
      id: orderId,
      release_upc: "199955742094",
      status: "paid",
    });
    mocks.getShopAssets.mockResolvedValue([
      {
        id: 1,
        release_upc: "199955742094",
        asset_key: "r2:18 master/199955742094/source.m4a",
        file_name: "30.000Genocides.m4a",
        file_size: 3716837,
        chunk_count: 1,
      },
    ]);

    const response = await servePaidOrderDownload(
      new Request(`https://nflt-records.com/api/download?order=${orderId}`),
    );

    expect(response.status).toBe(503);
    expect(await response.text()).toBe("Masters incomplets");
    expect(mocks.r2Head).not.toHaveBeenCalled();
    expect(mocks.r2Get).not.toHaveBeenCalled();
  });

  it("serves only a verified WAV after a paid status and normalizes the download name", async () => {
    const wav = minimalPcmWav();
    mocks.getShopOrder.mockResolvedValue({
      id: orderId,
      release_upc: upc,
      status: "paid",
    });
    mocks.getShopAssets.mockResolvedValue([
      {
        id: 1,
        release_upc: upc,
        asset_key: `r2:${objectKey}`,
        file_name: "medley.wav (1)",
        file_size: wav.byteLength,
        chunk_count: 1,
      },
    ]);
    mocks.r2Head.mockResolvedValue({ size: wav.byteLength });
    mocks.r2Get.mockImplementation(async (_key: string, options?: { range?: unknown }) => {
      if (options?.range) {
        return { arrayBuffer: async () => wav.slice(0, 12).buffer };
      }
      return { size: wav.byteLength, body: wav };
    });

    const response = await servePaidOrderDownload(
      new Request(`https://nflt-records.com/api/download?order=${orderId}`),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("audio/wav");
    expect(response.headers.get("content-disposition")).toBe('attachment; filename="medley-1.wav"');
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(new Uint8Array(await response.arrayBuffer())).toEqual(wav);
    expect(mocks.r2Head).toHaveBeenCalledWith(objectKey);
  });
});
