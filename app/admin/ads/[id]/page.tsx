"use client";
import { useAuth } from "@/app/context/AuthContext";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Sidebar } from "@/app/reusables/Sidebar";
import { Header } from "@/app/reusables/Header";
import api from "@/services/api";
import { format } from "date-fns";
import {toast} from 'react-toastify';
import Img from "@/app/reusables/Img";

interface AdDetails {
  _id: string;
  adCategory: string;
  imageField: string;
  detailAdFound: boolean;
  detailAdId: string | null;
  userName: string;
  userEmail: string;
  userPhone: string;
  userId: string;
  businessName: string;
  businessId: string;
  status: string;
  createdAt: string;
  approvedAt?: string | null;
  rejectedAt?: string | null;
  rejectionReason?: string | null;
  rejectedBy?: string | null;
  category: string;
  title: string;
  description: string;
  amount: number;
  location: string;
  negotiation: string | null;
  images: string[];
  plan: string;
  paymentStatus: string | null;
  priorityScore: number;
  viewCount: number;
  uniqueViewCount: number;

  // Pet fields
  petType?: string;
  breed?: string;
  age?: string;
  gender?: string;
  healthStatus?: string[];
  carAdId?: string | null;

  // Vehicle fields
  vehicleType?: string;
  make?: string;
  model?: string;
  year?: number | null;
  trim?: string;
  color?: string;
  interiorColor?: string;
  transmission?: string;
  vinChassisNumber?: string;
  carRegistered?: string;
  exchangePossible?: string;
  carKeyFeatures?: string;
  carType?: string;
  carBody?: string;
  fuel?: string;
  seat?: string;
  driveTrain?: string;
  numberOfCylinders?: string;
  engineSizes?: string;
  horsePower?: string;

  // Property fields
  propertyAddress?: string;
  propertyType?: string;
  propertyCondition?: string;
  propertyFacilities?: string;
  furnishing?: string;
  parking?: string;
  squareMeter?: string;
  ownershipStatus?: string;
  serviceCharge?: string;
  numberOfBedrooms?: string;
  numberOfToilet?: string;
  titleDocuments?: string;
  maximumAllowedGuest?: string;
  isSmokingAllowed?: string;
  isPartiesAllowed?: string;
  petsAllowed?: string;
  serviceFee?: string;

  // Gadget fields
  condition?: string;
  gadgetBrand?: string;
  storageCapacity?: string;
  ram?: string;
  operatingSystem?: string;
  simType?: string;
  network?: string;
  batteryHealth?: string;
  gadgetColor?: string;
  accessories?: string;
  warranty?: string;
  connectivityType?: string;

  // Equipment fields
  powerSource?: string;
  brand?: string;
  usageType?: string;

  // Laptop fields
  laptopType?: string;
  laptopBrand?: string;
  laptopStorage?: string;
  laptopOperating?: string;
  laptopRam?: string;
  laptopProcessor?: string;
  laptopScreenSize?: string;
  laptopBatteryHealth?: string;
  laptopColor?: string;
  laptopAccessories?: string;
  laptopWarranty?: string;
  laptopConnectivityType?: string;
  screenSize?: string;
  resolution?: string;
  refreshRate?: string;
  speedRating?: string;
  capacity?: string;

  // Kids fields
  ageGroup?: string;
  plasticGroup?: string;
  woodOptions?: string;
  size?: string;

  // Agriculture fields
  agricultureType?: string;
  unit?: string;
  bulkPrice?: string;
  feedType?: string;
  formulationType?: string;
  serviceMode?: string;
  experienceLevel?: string;
  availability?: string;

  // Job fields
  jobTitle?: string;
  jobType?: string;
  companyEmployerName?: string;
  yearOfExperience?: string;
  genderPreference?: string;
  applicationDeadline?: string;
  skils?: string;
  jobLocationType?: string;
  responsibilities?: string;
  requirements?: string;
  pricingType?: string;
  salaryRange?: string;

  // Hire fields
  hireTitle?: string;
  hireGender?: string;
  workMode?: string;
  yearsOfExperience?: string;
  relationshipStatus?: string;
  portfolioLink?: string;
  otherLinks?: string;
  skills?: string[];
  resume?: string;

  // Service fields
  serviceDuration?: string;
  serviceExperience?: string;
  serviceAvailability?: string;
  serviceLocation?: string;
  serviceDiscount?: string;

  // Fashion fields
  fashionType?: string;
  fashionBrand?: string;
  fashionMaterial?: string;
  fashionColor?: string;
  frameMaterial?: string;
  lensType?: string;
  frameShape?: string;
  fashionAccessories?: string;

  // Household fields
  householdType?: string;
  householdBrand?: string;
  householdPowersource?: string;
  householdMaterial?: string;
  roomType?: string;
  householdStyle?: string;
  householdColor?: string;
  powerType?: string;
  colorTemperature?: string;

  // Beauty fields
  beautyType?: string;
  hairType?: string;
  skinType?: string;
  targetConcern?: string;
  beautyBrand?: string;
  skinTone?: string;
  fragranceFamily?: string;
  beautyPowerSource?: string;

  // Construction fields
  constructionType?: string;
  constructionMaterial?: string;
  constructionUnit?: string;
  constructionBrand?: string;
  powerRating?: string;
  yearOfManufacture?: string;
  fuelType?: string;
  finish?: string;
  constructionColor?: string;
}

export default function AdDetailsPage() {
  const { isLoading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adDetails, setAdDetails] = useState<AdDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (params.id) {
      fetchAdDetails();
    }
  }, [params.id]);

  const fetchAdDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/profile/admin/ad-details/${params.id}`);
      setAdDetails(response.data.data);
    } catch (error) {
      console.error('Error fetching ad details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!adDetails) return;

    try {
      setActionLoading(true);
      await api.patch(`/profile/admin/approve-ad/${adDetails._id}`);
      
      toast.success('Ad approved successfully!');
      router.push('/ads-verification');
    } catch (error) {
      console.error('Error approving ad:', error);
      alert('Failed to approve ad');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectClick = () => {
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async () => {
    if (!adDetails) return;
    
    if (!rejectionReason.trim()) {
      toast.warn('Please provide a rejection reason');
      return;
    }

    try {
      setActionLoading(true);
      await api.put(`/profile/admin/reject-ad/${adDetails._id}`, {
        reason: rejectionReason
      });
      
      setShowRejectModal(false);
      setRejectionReason("");
      
      toast.success('Ad rejected successfully!');
      router.push('/ads-verification');
    } catch (error) {
      console.error('Error rejecting ad:', error);
      toast.error('Failed to reject ad');
    } finally {
      setActionLoading(false);
    }
  };

  // Keyboard navigation for carousel
  useEffect(() => {
    if (!adDetails) return;
    
    const handleKeyPress = (e: KeyboardEvent) => {
      if (adDetails.images.length <= 1) return;
      
      if (e.key === 'ArrowLeft') {
        setCurrentImageIndex(prev => prev === 0 ? adDetails.images.length - 1 : prev - 1);
      } else if (e.key === 'ArrowRight') {
        setCurrentImageIndex(prev => prev === adDetails.images.length - 1 ? 0 : prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [adDetails?.images.length]);



  const renderCategorySpecificFields = () => {
    if (!adDetails) return null;

    switch (adDetails.adCategory) {
      case 'pet':
        return (
          <>
            {adDetails.petType && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Pet Type:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.petType}</p>
              </div>
            )}
            {adDetails.breed && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Breed:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.breed}</p>
              </div>
            )}
            {adDetails.age && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Age:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.age}</p>
              </div>
            )}
            {adDetails.gender && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Gender:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.gender}</p>
              </div>
            )}
            {adDetails.healthStatus && adDetails.healthStatus.length > 0 && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Health Status:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.healthStatus.join(', ')}</p>
              </div>
            )}
          </>
        );

      case 'vehicle':
        return (
          <>
            {adDetails.vehicleType && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Vehicle Type:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.vehicleType}</p>
              </div>
            )}
            {adDetails.make && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Make:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.make}</p>
              </div>
            )}
            {adDetails.model && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Model:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.model}</p>
              </div>
            )}
            {adDetails.year && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Year:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.year}</p>
              </div>
            )}
            {adDetails.color && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Color:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.color}</p>
              </div>
            )}
            {adDetails.interiorColor && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Interior Color:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.interiorColor}</p>
              </div>
            )}
            {adDetails.transmission && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Transmission:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.transmission}</p>
              </div>
            )}
            {adDetails.vinChassisNumber && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">VinChassis Number:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.vinChassisNumber}</p>
              </div>
            )}
            {adDetails.carRegistered && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Car Registration:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.carRegistered}</p>
              </div>
            )}
            {adDetails.exchangePossible && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Exchange Possible:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.exchangePossible}</p>
              </div>
            )}
            {adDetails.carKeyFeatures && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Carkey Features:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.carKeyFeatures}</p>
              </div>
            )}
            {adDetails.carType && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Car Type:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.carType}</p>
              </div>
            )}
            {adDetails.fuel && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Fuel Type:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.fuel}</p>
              </div>
            )}
            {adDetails.carBody && (
              <div>1
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Body Type:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.carBody}</p>
              </div>
            )}
            {adDetails.seat && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Seat:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.seat}</p>
              </div>
            )}
            {adDetails.driveTrain && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Drive Train:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.driveTrain}</p>
              </div>
            )}
            {adDetails.numberOfCylinders && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Number of Cyliners:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.numberOfCylinders}</p>
              </div>
            )}
            {adDetails.engineSizes && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Engine Sizes:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.engineSizes}</p>
              </div>
            )}
            {adDetails.horsePower && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Horse power:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.horsePower}</p>
              </div>
            )}
          </>
        );

      case 'property':
        return (
          <>
            {adDetails.propertyType && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Property Type:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.propertyType}</p>
              </div>
            )}
            {adDetails.propertyAddress && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Address:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.propertyAddress}</p>
              </div>
            )}
            {adDetails.numberOfBedrooms && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Bedrooms:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.numberOfBedrooms}</p>
              </div>
            )}
            {adDetails.numberOfToilet && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Bathrooms:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.numberOfToilet}</p>
              </div>
            )}
            {adDetails.furnishing && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Furnishing:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.furnishing}</p>
              </div>
            )}
            {adDetails.parking && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Parking:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.parking}</p>
              </div>
            )}
            {adDetails.squareMeter && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Square Meter:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.squareMeter}</p>
              </div>
            )}
            {adDetails.propertyCondition && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Property Condition: </span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.propertyCondition}</p>
              </div>
            )}
            {adDetails.propertyFacilities && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Property Facilities</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.propertyFacilities}</p>
              </div>
            )}
            {adDetails.ownershipStatus && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Ownership Status:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.ownershipStatus}</p>
              </div>
            )}
            {adDetails.serviceCharge && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Service Charge:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.serviceCharge}</p>
              </div>
            )}
            {adDetails?.titleDocuments && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Title Documents:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails?.titleDocuments ||"N/A"}</p>
              </div>
            )}
            {adDetails.maximumAllowedGuest && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Maximum Allowed Guest:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.maximumAllowedGuest}</p>
              </div>
            )}
            {adDetails.isSmokingAllowed && (
             <div>
              <span className="block text-[14px] font-[600] text-[#525252] mb-1">Smoking Allowed:</span>
              <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.isSmokingAllowed}</p>
             </div>
            )}
            {adDetails.isPartiesAllowed && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Parties Allowed:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.isPartiesAllowed}</p>
              </div>
            )}
            {adDetails.petsAllowed && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Pets Allowed:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.petsAllowed}</p>
              </div>
            )}
           
          </>
        );

      case 'gadget':
        return (
          <>
            {adDetails.gadgetBrand && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Brand:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.gadgetBrand}</p>
              </div>
            )}
            {adDetails.storageCapacity && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Storage:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.storageCapacity}</p>
              </div>
            )}
            {adDetails.ram && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">RAM:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.ram}</p>
              </div>
            )}
            {adDetails.operatingSystem && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Operating System:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.operatingSystem}</p>
              </div>
            )}
            {adDetails.simType && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Sim Type:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.simType}</p>
              </div>
            )}
            {adDetails.network && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Network:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.network}</p>
              </div>
            )}
            {adDetails.batteryHealth && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Battery Health:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.batteryHealth}</p>
              </div>
            )}
            {adDetails.gadgetColor && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Gadget Color:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.gadgetColor}</p>
              </div>
            )}
            {adDetails.accessories && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Accessories:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.accessories}</p>
              </div>
            )}
            {adDetails.connectivityType && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Connectivity Type:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.connectivityType}</p>
              </div>
            )}
            {adDetails.condition && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Condition:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.condition}</p>
              </div>
            )}
            {adDetails.warranty && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Warranty:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.warranty}</p>
              </div>
            )}
          </>
        );

      case 'laptop':
        return (
          <>
           {adDetails.laptopType && (
            <div>
              <span className="block text-[14px] font-[600] text-[#525252] mb-1">Laptop Type:</span>
              <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.laptopType}</p>
            </div>
           )}
            {adDetails.laptopBrand && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Brand:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.laptopBrand}</p>
              </div>
            )}
            {adDetails.laptopProcessor && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Processor:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.laptopProcessor}</p>
              </div>
            )}
            {adDetails.laptopRam && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">RAM:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.laptopRam}</p>
              </div>
            )}
            {adDetails.laptopStorage && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Storage:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.laptopStorage}</p>
              </div>
            )}
            {adDetails.laptopBatteryHealth && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Battery Health:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.laptopBatteryHealth}</p>
              </div>
            )}
            {adDetails.laptopColor && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Color:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.laptopColor}</p>
              </div>
            )}
            {adDetails.laptopAccessories && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Accessories:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.laptopAccessories}</p>
              </div>
            )}
            {adDetails.laptopWarranty && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Warranty:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.laptopWarranty}</p>
              </div>
            )}
            {adDetails.laptopConnectivityType && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Connectivity Type:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.laptopConnectivityType}</p>
              </div>
            )}
            {adDetails.screenSize && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Screen Size:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.screenSize}</p>
              </div>
            )}
            {adDetails.resolution && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Resolution:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.resolution}</p>
              </div>
            )}
            {adDetails.refreshRate && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Refresh Rate:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.refreshRate}</p>
              </div>
            )}
            {adDetails.speedRating && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Speed Rating:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.speedRating}</p>
              </div>
            )}
            {adDetails.condition && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Condition:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.condition}</p>
              </div>
            )}
            {adDetails.capacity && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Capacity:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.capacity}</p>
              </div>
            )}
          </>
        );

      case 'job':
        return (
          <>
            {adDetails.jobTitle && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Job Title:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.jobTitle}</p>
              </div>
            )}
            {adDetails.jobType && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Job Type:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.jobType}</p>
              </div>
            )}
            {adDetails.companyEmployerName && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Company:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.companyEmployerName}</p>
              </div>
            )}
            {adDetails.experienceLevel && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Experience Level:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.experienceLevel}</p>
              </div>
            )}
            {adDetails.location && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Location:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.location}</p>
              </div>
            )}
            {adDetails.salaryRange && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Salary Range:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.salaryRange}</p>
              </div>
            )}
            {adDetails.yearOfExperience && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Year of Experience:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.yearOfExperience}</p>
              </div>
            )}
            {adDetails.genderPreference && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Gender Preference:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.genderPreference}</p>
              </div>
            )}
            {adDetails.applicationDeadline && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Application Deadline</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.applicationDeadline}</p>
              </div>
            )}
            {adDetails.skils && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Skills</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.skils}</p>
              </div>
            )}
            {adDetails.jobLocationType && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Location Type:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.jobLocationType}</p>
              </div>
            )}
            {adDetails.responsibilities && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Responsibilities:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.responsibilities}</p>
              </div>
            )}
            {adDetails.requirements && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Requirements:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.requirements}</p>
              </div>
            )}
            {adDetails.pricingType && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Pricing Type:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.pricingType}</p>
              </div>
            )}
            {adDetails.salaryRange && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Salary Range:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.salaryRange}</p>
              </div>
            )}
          </>
        );

      case 'hire':
        return (
          <>
            {adDetails.hireTitle && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Hire Title:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.hireTitle}</p>
              </div>
            )}
            {adDetails.experienceLevel && 
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Experience Level:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.experienceLevel}</p>
              </div>
            }
            {adDetails.workMode && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Work Mode:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.workMode}</p>
              </div>
            )}
            {adDetails.yearsOfExperience && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Years of Experience:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.yearsOfExperience}</p>
              </div>
            )}
            {adDetails.relationshipStatus && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Relationship Status:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.relationshipStatus}</p>
              </div>
            )}
           {adDetails.portfolioLink && (
  <div>
    <span className="block text-[14px] font-[600] text-[#525252] mb-1">Portfolio Link:</span>
    <a 
     href={adDetails.portfolioLink}
     target="_blank"
     rel="noopener noreferrer"
     className="text-[#000087] mt-2 text-[14px] md:text-[16px] font-medium font-inter underline block">
       View link
    </a>
  </div>
)}
     {adDetails.otherLinks && (
  <div>
    <span className="block text-[14px] font-[600] text-[#525252] mb-1">Other Links:</span>
    <a 
     href={adDetails.otherLinks}
     target="_blank"
     rel="noopener noreferrer"
     className="text-[#000087] mt-2 text-[14px] md:text-[16px] font-medium font-inter underline block">
       View link
    </a>
  </div>
)}
            {adDetails.skills && adDetails.skills.length > 0 && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Skills:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.skills}</p>
              </div>
            )}
            {adDetails.pricingType && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Pricing Type:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.pricingType}</p>
              </div>
            )}
              {adDetails.resume && (
  <div>
    <span className="block text-[14px] font-[600] text-[#525252] mb-1">Resume:</span>
    <a 
     href={adDetails.resume}
     target="_blank"
     rel="noopener noreferrer"
     className="text-[#000087] mt-2 text-[14px] md:text-[16px] font-medium font-inter underline block">
       View Resume
    </a>
  </div>
)}
            {adDetails.salaryRange && (
             <div>
              <span className="block text-[14px] font-[600] text-[#525252] mb-1">
               Salary Range:
             </span>

             <p className="text-[#4C4C4C] text-[14px] font-[400]">
                ₦{adDetails.salaryRange?.toLocaleString()}
              </p>
            </div>
           )}
          </>
        );

      case 'fashion':
        return (
          <>
            {adDetails.fashionType && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Fashion Type:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.fashionType}</p>
              </div>
            )}
            {adDetails.fashionBrand && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Brand:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.fashionBrand}</p>
              </div>
            )}
            {adDetails.size && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Size:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.size}</p>
              </div>
            )}
            {adDetails.fashionColor && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Color:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.fashionColor}</p>
              </div>
            )}
            {adDetails.fashionMaterial && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Fashion Material:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.fashionMaterial}</p>
              </div>
            )}
            {adDetails.frameMaterial && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Frame Material:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.frameMaterial}</p>
              </div>
            )}
            {adDetails.lensType && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Lens Type:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.lensType}</p>
              </div>
            )}
            {adDetails.frameShape && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Frame Shape:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.frameShape}</p>
              </div>
            )}
            {adDetails.fashionAccessories && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Fashion Accessories:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.fashionAccessories}</p>
              </div>
            )}
            {adDetails.condition && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Condition:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.condition}</p>
              </div>
            )}
          </>
        );

      case 'household':
        return (
          <>
            {adDetails.householdType && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Household Type:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.householdType}</p>
              </div>
            )}
            {adDetails.householdBrand && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Brand:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.householdBrand}</p>
              </div>
            )}
            {adDetails.size && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Size:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.size}</p>
              </div>
            )}
            {adDetails.condition && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Condition:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.condition}</p>
              </div>
            )}
            {adDetails.householdMaterial && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Material:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.householdMaterial}</p>
              </div>
            )}
            {adDetails.householdPowersource && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Power Source:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.householdPowersource}</p>
              </div>
            )}
             {adDetails.roomType && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Room Type:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.roomType}</p>
              </div>
            )}
            {adDetails.householdStyle && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">House Style:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.householdStyle}</p>
              </div>
            )}
            {adDetails.householdColor && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Color:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.householdColor}</p>
              </div>
            )}
            {adDetails.powerType && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Power Type:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.powerType}</p>
              </div>
            )}
            {adDetails.colorTemperature && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Color Temperature:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.colorTemperature}</p>
              </div>
            )}
          </>
        );

      case 'beauty':
        return (
          <>
            {adDetails.beautyType && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Beauty Type:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.beautyType}</p>
              </div>
            )}
            {adDetails.beautyBrand && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Brand:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.beautyBrand}</p>
              </div>
            )}
            {adDetails.skinType && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Skin Type:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.skinType}</p>
              </div>
            )}
            {adDetails.hairType && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Hair Type:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.hairType}</p>
              </div>
            )}
            {adDetails.gender && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Gender:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.gender}</p>
              </div>
            )}
            {adDetails.targetConcern && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Target Concerns:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.targetConcern}</p>
              </div>
            )}
            {adDetails.skinTone && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Skinton:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.skinTone}</p>
              </div>
            )}
            {adDetails.fragranceFamily && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Fragrance Family:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.fragranceFamily}</p>
              </div>
            )}
            {adDetails.beautyPowerSource && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Power Source:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.beautyPowerSource}</p>
              </div>
            )}
            {adDetails.condition && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Condition:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.condition}</p>
              </div>
            )}
          </>
        );

      case 'construction':
        return (
          <>
            {adDetails.constructionType && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Construction Type:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.constructionType}</p>
              </div>
            )}
            {adDetails.constructionBrand && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Brand:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.constructionBrand}</p>
              </div>
            )}
            {adDetails.constructionMaterial && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Material:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.constructionMaterial}</p>
              </div>
            )}
            {adDetails.constructionUnit && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Unit:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.constructionUnit}</p>
              </div>
            )}
            {adDetails.condition && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Condition:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.condition}</p>
              </div>
            )}
            {adDetails.warranty && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Warranty:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.warranty}</p>
              </div>
            )}
            {adDetails.powerRating && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Power Rating:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.powerRating}</p>
              </div>
            )}
            {adDetails.yearOfManufacture && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Year of Manufacture:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.yearOfManufacture}</p>
              </div>
            )}
            {adDetails.fuelType && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Fuel Type:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.fuelType}</p>
              </div>
            )}
            {adDetails.finish && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Finish:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.finish}</p>
              </div>
            )}
            {adDetails.constructionColor && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Color:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.constructionColor}</p>
              </div>
            )}
            {adDetails.size && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Size:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.size}</p>
              </div>
            )}
            {adDetails.experienceLevel && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Experience Level:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.experienceLevel}</p>
              </div>
            )}
            {Array.isArray(adDetails.bulkPrice) && adDetails.bulkPrice.length > 0 && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">
                  Bulk Price:
                </span>

                <div className="space-y-1">
                   {adDetails.bulkPrice.map((item: { quantity: number; unit: string; amountPerUnit: number}, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between item-center"
                     >
                      <span className="text-[#525252] font-medium text-[14px]">
                        {item.quantity} {item.unit}
                      </span>

                      <span className="text-[#000087] font-semibold text-[14px]">
                        ₦{Number(item.amountPerUnit).toLocaleString()}
                      </span>
                    </div>
                   ))}
                </div>
              </div>
            )}
          </>
        );

      case 'agriculture':
        return (
          <>
            {adDetails.agricultureType && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Agriculture Type:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.agricultureType}</p>
              </div>
            )}
            {adDetails.condition && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Condition:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.condition}</p>
              </div>
            )}
            {adDetails.unit && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Unit:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.unit}</p>
              </div>
            )}
            {Array.isArray(adDetails?.bulkPrice) && adDetails.bulkPrice.length > 0 && (
              <div className="bg-[#EDEDED] md:w-[650px] h-auto md:rounded-[12px] p-8 mt-4">
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">
                  Bulk Prices
                </span>

              <div className="mt-2 space-y-2">
                {adDetails.bulkPrice.map(
                 (
                  item: { quantity: number; unit: string; amountPerUnit: number },
                  index: number
                ) => (
               <div
                 key={index}
                className="flex justify-between items-center">
                 <span className="text-[#525252] font-medium font-inter text-[14px]">
                  {item.quantity} {item.unit}
                </span>

                <span className="text-[#000087] font-semibold text-[14px]">
                  ₦{Number(item.amountPerUnit).toLocaleString()}
               </span>
             </div>
               )
              )}
             </div>
            </div>
            )}
             {adDetails.feedType && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Feed Type:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.feedType}</p>
              </div>
            )}
            {adDetails.brand && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Brand:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.brand}</p>
              </div>
            )}
            {adDetails.formulationType && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Formulation Type:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.formulationType}</p>
              </div>
            )}
            {adDetails.serviceMode && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Service Mode:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.serviceMode}</p>
              </div>
            )}
            {adDetails.experienceLevel && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Experience Level:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.experienceLevel}</p>
              </div>
            )}
            {adDetails.availability && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Availability:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.availability}</p>
              </div>
            )}
          </>
        );

      case 'kids':
        return (
          <>
            {adDetails.condition && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Condition:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.condition}</p>
              </div>
            )}
            {adDetails.color && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Color:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.color}</p>
              </div>
            )}
            {adDetails.gender && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Gender:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.gender}</p>
              </div>
            )}
            {adDetails.ageGroup && (
              <div>
                <span className="block text-[14px] font-[600] text-[#525252] mb-1">Age Group:</span>
                <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.ageGroup}</p>
              </div>
            )}
          </>
        );

     case 'equipment':
    return (
      <>
      {adDetails.brand && (
        <div>
          <span className="block text-[14px] font-[600] text-[#525252] mb-1">Brand:</span>
          <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.brand}</p>
        </div>
      )}
      {adDetails.condition && (
        <div>
          <span className="block text-[14px] font-[600] text-[#525252] mb-1">Condition:</span>
          <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.condition}</p>
        </div>
      )}
      {adDetails.powerSource && (
        <div>
          <span className="block text-[14px] font-[600] text-[#525252] mb-1">Power Source:</span>
          <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.powerSource}</p>
        </div>
      )}
      {adDetails.usageType && (
        <div>
          <span className="block text-[14px] font-[600] text-[#525252] mb-1">Usage Type:</span>
          <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.usageType}</p>
        </div>
      )}
    </>
  );

  case 'service':
    return (
      <>
       {adDetails.serviceDuration && (
        <div>
          <span className="block text-[14px] font-[600] text-[#525252] mb-1">Service Duration:</span>
          <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.serviceDuration}</p>
        </div>
      )}
      {adDetails.serviceExperience && (
        <div>
          <span className="block text-[14px] font-[600] text-[#525252] mb-1">Experience:</span>
          <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.serviceExperience}</p>
        </div>
      )}
      {adDetails.serviceAvailability && (
        <div>
          <span className="block text-[14px] font-[600] text-[#525252] mb-1">Availability:</span>
          <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.serviceAvailability}</p>
        </div>
      )}
      {adDetails.serviceLocation && (
        <div>
          <span className="block text-[14px] font-[600] text-[#525252] mb-1">Service Location:</span>
          <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.serviceLocation}</p>
        </div>
      )}
      {adDetails.yearOfExperience && (
        <div>
          <span className="block text-[14px] font-[600] text-[#525252] mb-1">Years of Experience:</span>
          <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.yearOfExperience}</p>
        </div>
      )}
      {adDetails.pricingType && (
        <div>
          <span className="block text-[14px] font-[600] text-[#525252] mb-1">Pricing Type:</span>
          <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.pricingType}</p>
        </div>
      )}
      {adDetails.serviceDiscount && (
        <div>
          <span className="block text-[14px] font-[600] text-[#525252] mb-1">Discount:</span>
          <p className="text-[#4C4C4C] text-[14px] font-[400]">{adDetails.serviceDiscount}</p>
        </div>
      )}
    </>
  );

default:
  return null;
}
};

if (isLoading || loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );
}

if (!adDetails) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ad Not Found</h2>
        <button
          onClick={() => router.push('/admin/ads-verification')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Back to Ads
        </button>
      </div>
    </div>
  );
}

return (
  <div className="flex min-h-screen bg-[#F9FAFB] overflow-x-hidden">
    <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

    <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
      <Header isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <main className="p-6">
        {/* Header with Back Button */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => router.push('/ads-verification')}
            className="flex items-center gap-2 text-[#525252] font-[400] text-[14px]"
          >
            Ads 
            <Img 
              src="/rightArrow.svg"
              alt="Right Arrow"
              width={4}
              height={4}
            />
          </button> 
          <h1 className="text-[14px] font-[400] text-[#000087]">View Details</h1>
        </div>

        {/* Ad Details Card */}
        <div className="p-6">
          {/* Image Carousel */}
          {adDetails.images.length > 0 && (
            <div className="mb-6 relative">
              <Img
                src={adDetails.images[currentImageIndex]}
                width={800}
                height={400}
                alt={`Ad image ${currentImageIndex + 1}`}
                className="w-[481px] md:w-full h-[400px] object-cover rounded-[8px]"
              />
              
              {/* Navigation Arrows */}
              {adDetails.images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex(prev => prev === 0 ? adDetails.images.length - 1 : prev - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex(prev => prev === adDetails.images.length - 1 ? 0 : prev + 1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
              
              {/* Image Counter */}
              {adDetails.images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {adDetails.images.length}
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Common Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div>
                  <span className="block text-sm font-medium text-gray-500 mb-1">Category:</span>
                  <p className="text-gray-900">{adDetails.category || 'N/A'}</p>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500 mb-1">Ad Type:</span>
                  <p className="text-gray-900 capitalize">{adDetails.adCategory}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <span className="block text-sm font-medium text-gray-500 mb-1">Location:</span>
                  <p className="text-gray-900">{adDetails.location || 'N/A'}</p>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500 mb-1">User:</span>
                  <p className="text-gray-900">{adDetails.userName}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <span className="block text-sm font-medium text-gray-500 mb-1">Business:</span>
                  <p className="text-gray-900">{adDetails.businessName}</p>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500 mb-1">Status:</span>
                  <p className={`inline-flex px-2 py-1 rounded-full text-sm font-medium ${
                    adDetails.status === 'approved' ? 'bg-green-100 text-green-800' :
                    adDetails.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {adDetails.status}
                  </p>
                </div>
              </div>

              {adDetails.title && (
                <div>
                  <span className="block text-sm font-medium text-gray-500 mb-1">Title:</span>
                  <p className="text-gray-900">{adDetails.title}</p>
                </div>
              )}

              {adDetails.description && (
                <div>
                  <span className="block text-sm font-medium text-gray-500 mb-1">Description:</span>
                  <p className="text-gray-900">{adDetails.description}</p>
                </div>
              )}

              {/* Category-specific fields */}
              {renderCategorySpecificFields()}
            </div>

            {/* Right Column - Additional Info */}
            <div className="space-y-4">
              {adDetails.amount > 0 && (
                <div>
                  <span className="block text-sm font-medium text-gray-500 mb-1">Amount:</span>
                  <p className="text-2xl font-semibold text-gray-900">
                    ₦{adDetails.amount.toLocaleString()}
                  </p>
                </div>
              )}

              {adDetails.negotiation && (
                <div>
                  <span className="block text-sm font-medium text-gray-500 mb-1">Negotiation:</span>
                  <p className="text-gray-900">{adDetails.negotiation}</p>
                </div>
              )}

              <div>
                <span className="block text-sm font-medium text-gray-500 mb-1">Contact:</span>
                <p className="text-gray-900">{adDetails.userEmail}</p>
                <p className="text-gray-900">{adDetails.userPhone}</p>
              </div>

              <div>
                <span className="block text-sm font-medium text-gray-500 mb-1">Date Created:</span>
                <p className="text-gray-900">
                  {format(new Date(adDetails.createdAt), 'MMMM dd, yyyy hh:mm a')}
                </p>
              </div>

              {adDetails.approvedAt && (
                <div>
                  <span className="block text-sm font-medium text-gray-500 mb-1">Date Approved:</span>
                  <p className="text-gray-900">
                    {format(new Date(adDetails.approvedAt), 'MMMM dd, yyyy hh:mm a')}
                  </p>
                </div>
              )}

              {adDetails.rejectedAt && (
                <div>
                  <span className="block text-sm font-medium text-gray-500 mb-1">Date Rejected:</span>
                  <p className="text-gray-900">
                    {format(new Date(adDetails.rejectedAt), 'MMMM dd, yyyy hh:mm a')}
                  </p>
                </div>
              )}

              {adDetails.rejectionReason && (
                <div>
                  <span className="block text-sm font-medium text-gray-500 mb-1">Rejection Reason:</span>
                  <p className="text-gray-900">{adDetails.rejectionReason}</p>
                </div>
              )}

              <div>
                <span className="block text-sm font-medium text-gray-500 mb-1">Plan:</span>
                <p className="text-gray-900 capitalize">{adDetails.plan}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-sm font-medium text-gray-500 mb-1">Views:</span>
                  <p className="text-gray-900">{adDetails.viewCount}</p>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500 mb-1">Unique Views:</span>
                  <p className="text-gray-900">{adDetails.uniqueViewCount}</p>
                </div>
              </div>

              {/* Thumbnail Images */}
              {adDetails.images.length > 1 && (
                <div>
                  <span className="block text-sm font-medium text-gray-500 mb-2">Additional Images:</span>
                  <div className="grid grid-cols-4 gap-2">
                    {adDetails.images.slice(0, 8).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-full h-20 rounded-lg border-2 overflow-hidden transition-all ${
                          currentImageIndex === index ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Img
                          src={image}
                          width={100}
                          height={100}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {adDetails.status === 'pending' && (
            <div className="flex gap-3 pt-6 mt-6 justify-end border-t border-gray-200">
              <button
                onClick={handleRejectClick}
                disabled={actionLoading}
                className="px-6 py-3 w-full md:w-[221px] h-[52px] border-[1px]  
                border-[#CB0D0D] text-[#CB0D0D] text-[16px] font-[600] rounded-[8px] 
                hover:bg-red-50 disabled:opacity-50 
                disabled:cursor-not-allowed font-medium"
              >
                {actionLoading ? 'Processing...' : 'Reject'}
              </button>
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="px-6 py-3 w-full md:w-[221px] h-[52px] 
                bg-gradient-to-r from-[#00A8DF] to-[#1031AA] 
                text-white rounded-[8px] text-[16px] font-[600] disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {actionLoading ? 'Processing...' : 'Approve'}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>

    {/* Rejection Modal */}
    {showRejectModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Reject Ad</h3>
          
          <div className="mb-4">
            <span className="block text-sm font-medium text-gray-700 mb-2">
              Rejection Reason *
            </span>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Please provide a reason for rejecting this ad..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px]"
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowRejectModal(false);
                setRejectionReason("");
              }}
              disabled={actionLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleRejectSubmit}
              disabled={actionLoading || !rejectionReason.trim()}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading ? 'Rejecting...' : 'Confirm Rejection'}
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
}