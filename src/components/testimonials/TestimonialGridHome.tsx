import { unstable_noStore as noStore } from "next/cache";
import { connectDB } from "@/lib/utils/database";
import { getFeaturedTestimonials } from "@/admin/models/Testimonial";
import TestimonialCard from "./TestimonialCard";
import TestimonialHero from "./TestimonialHero";

interface Testimonial {
  _id: string;
  name: string;
  position: string;
  company: string;
  testimonial: string;
  profilePicture: string;
  companyLogo: string;
  linkedinUrl: string;
  companySiteUrl: string;
  videoUrl?: string;
  projectType: string;
  status: string;
  featured: boolean;
  displayOrder: number;
  createdAt: string;
}

interface FeaturedTestimonialResult {
  success: boolean;
  data?: unknown;
}

const toPlainObject = (value: unknown): Record<string, any> => {
  if (value && typeof value === "object") {
    const doc = value as { toObject?: (options?: Record<string, unknown>) => unknown };
    if (typeof doc.toObject === "function") {
      return doc.toObject({ getters: true, virtuals: false }) as Record<string, any>;
    }
  }

  return JSON.parse(JSON.stringify(value ?? {}));
};

const normalizeTestimonials = (items: unknown[]): Testimonial[] => {
  return items.map((item, index, array) => {
    const plain = toPlainObject(item);
    const createdAt = plain.createdAt instanceof Date
      ? plain.createdAt.toISOString()
      : typeof plain.createdAt === "string"
        ? plain.createdAt
        : new Date().toISOString();

    return {
      _id: typeof plain._id === "string" ? plain._id : plain._id?.toString?.() ?? `testimonial-${index}`,
      name: typeof plain.name === "string" ? plain.name : "",
      position: typeof plain.position === "string" ? plain.position : "",
      company: typeof plain.company === "string" ? plain.company : "",
      testimonial: typeof plain.testimonial === "string" ? plain.testimonial : "",
      profilePicture: typeof plain.profilePicture === "string" ? plain.profilePicture : "",
      companyLogo: typeof plain.companyLogo === "string" ? plain.companyLogo : "",
      linkedinUrl: typeof plain.linkedinUrl === "string" ? plain.linkedinUrl : "",
      companySiteUrl: typeof plain.companySiteUrl === "string" ? plain.companySiteUrl : "",
      videoUrl: typeof plain.videoUrl === "string" ? plain.videoUrl : undefined,
      projectType: typeof plain.projectType === "string" ? plain.projectType : "",
      status: typeof plain.status === "string" ? plain.status : "",
      featured: false,
      displayOrder: typeof plain.displayOrder === "number" ? plain.displayOrder : index,
      createdAt,
    };
  });
};

const fetchFeaturedTestimonials = async (): Promise<Testimonial[] | null> => {
  noStore();

  try {
    await connectDB();
    const result = (await getFeaturedTestimonials()) as FeaturedTestimonialResult;

    if (!result?.success || !Array.isArray(result.data) || result.data.length === 0) {
      return null;
    }

    const limited = result.data.slice(0, 3);
    const normalized = normalizeTestimonials(limited);

    return normalized.length ? normalized : null;
  } catch (error) {
    console.error("Error fetching featured testimonials:", error);
    return null;
  }
};

const TestimonialGridHome = async () => {
  const testimonials = await fetchFeaturedTestimonials();

  if (!testimonials) {
    return null;
  }

  const testimonialCount = testimonials.length;
  const isCentered = testimonialCount < 3;

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .testimonial-bento-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: repeat(1, 250px);
            gap: 14px;
          }

          .testimonial-bento-grid.centered {
            justify-content: center;
            grid-template-columns: repeat(auto-fit, minmax(300px, 400px));
            max-width: ${testimonialCount === 1 ? '400px' : '850px'};
            margin: 0 auto;
          }

          .testimonial-bento-item {
            background: rgba(255, 255, 255, 0.8);
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: 100%;
            position: relative;
            overflow: hidden;
          }

          .testimonial-bento-item::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 1;
          }

          .testimonial-bento-item:hover::before {
            opacity: 1;
          }

          .testimonial-bento-item.rowspan-2 {
            grid-row: span 2;
          }

          @media (max-width: 991px) {
            .testimonial-bento-grid {
              grid-template-columns: 1fr;
              grid-template-rows: none;
            }

            .testimonial-bento-grid.centered {
              max-width: 100%;
            }

            .testimonial-bento-item.rowspan-2 {
              grid-row: span 1;
            }
          }
        `
      }} />
      
      <div style={{ marginTop: "-120px" }}>
        <TestimonialHero />

        <div className="container mt-60 mb-5">
          <div className={`testimonial-bento-grid${isCentered ? ' centered' : ''}`}>
            {testimonials.map((item) => (
              <div
                key={item._id}
                className={`testimonial-bento-item${item.videoUrl ? " rowspan-2" : ""}`}
              >
                <TestimonialCard testimonial={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default TestimonialGridHome;
