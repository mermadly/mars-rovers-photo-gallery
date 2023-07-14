export default function Gallery({ photosArray }) {
  return (
    <div className="photo-gallery">
      {photosArray?.map((photo) => {
        return (
          <img
            key={photo.id}
            src={photo.img_src}
            alt=""
            style={{ maxWidth: "250px" }}
          />
        );
      })}
    </div>
  );
}
