export function isRevokedOrder(status: string): boolean {
  return status === 'refunded' || status === 'cancelled';
}

export function canDeliverOrder(order: { status: string; paid_at?: string | null }): boolean {
  return !isRevokedOrder(order.status) && (
    order.status === 'paid' || order.status === 'completed' || Boolean(order.paid_at)
  );
}

const supportedExtensions = new Set(['xlsx', 'pdf', 'zip']);

export function productDownloadFilename(storagePath: string, title?: string | null, fileType?: string | null): string {
  const pathExtension = storagePath.split('/').pop()?.split('.').pop()?.toLowerCase() || '';
  const declaredExtension = fileType?.trim().toLowerCase() || '';
  const extension = supportedExtensions.has(pathExtension) ? pathExtension
    : supportedExtensions.has(declaredExtension) ? declaredExtension : 'bin';
  const name = (title || 'digzoom-product')
    .replace(/\.(xlsx|pdf|zip)$/i, '')
    .replace(/[^a-zA-Z0-9_ -]/g, '')
    .trim().slice(0, 120).trim() || 'digzoom-product';
  return `${name}.${extension}`;
}
