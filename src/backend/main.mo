import BlobStorageMixin "blob-storage/Mixin";

persistent actor Backend {
  include BlobStorageMixin()
}
