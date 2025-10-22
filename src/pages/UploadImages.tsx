import MentorshipImageUploader from "@/components/MentorshipImageUploader";

const UploadImages = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-center mb-8">Upload de Imagens</h1>
        <MentorshipImageUploader />
      </div>
    </div>
  );
};

export default UploadImages;
