import Image from "next/image";

const CareerGallery = () => {
  const galleryImages = {
    primary: {
      src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
      alt: "Team strategizing together in a modern office",
      width: 600,
      height: 900,
      credit: "Unsplash – @brookecagle",
    },
    feature: {
      src: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=1200&q=80",
      alt: "Diverse teammates uniting hands in the office",
      width: 1200,
      height: 1600,
      credit: "Unsplash – @krakenimages",
    },
    stackedTop: {
      src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
      alt: "Colleagues collaborating around laptops",
      width: 800,
      height: 600,
      credit: "Unsplash – @kmuza",
    },
    stackedBottom: {
      src: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
      alt: "Career growth conversation in bright workspace",
      width: 1200,
      height: 900,
      credit: "Unsplash – @protohaus",
    },
  };

  return (
    <>
      <section className="career__gallery">
        <div className="container g-0 line pt-140 pb-140">
          <span className="line-3"></span>
          <div className="row">
            <div className="col-xxl-12">
              <ul>
                <li>Future</li>
                <li>Community</li>
                <li>Honor</li>
              </ul>
              <p>
                What sets us apart is what brings us together – a shared passion
                for solving business challenges through strategy, design, and
                engineering. We are the sum total of our team, their unique
                perspectives, capabilities, and our ability to collaborate from
                ideation to deployment.
              </p>
            </div>
          </div>

          <div className="row">
            <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3">
              <div className="career__gallery-img">
                <Image
                  priority
                  width={320}
                  height={480}
                  style={{ height: "auto" }}
                  src={galleryImages.primary.src}
                  alt={galleryImages.primary.alt}
                />
              </div>
            </div>
            <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-5">
              <div className="career__gallery-img img-anim">
                <Image
                  priority
                  width={640}
                  height={850}
                  style={{ height: "auto" }}
                  src={galleryImages.feature.src}
                  alt={galleryImages.feature.alt}
                  data-speed="auto"
                />
              </div>
            </div>
            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4">
              <div className="career__gallery-img">
                <Image
                  priority
                  width={360}
                  height={270}
                  style={{ height: "auto" }}
                  src={galleryImages.stackedTop.src}
                  alt={galleryImages.stackedTop.alt}
                />
                <Image
                  priority
                  width={480}
                  height={360}
                  style={{ height: "auto" }}
                  src={galleryImages.stackedBottom.src}
                  alt={galleryImages.stackedBottom.alt}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CareerGallery;
