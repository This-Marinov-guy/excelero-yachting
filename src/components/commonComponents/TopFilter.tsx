"use client";

import Image from "next/image";
import { Container } from "reactstrap";
import ParticleComponent from "./ParticleComponent";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setBoatType } from "@/redux/reducers/FilterSlice";
import { useState, useEffect } from "react";

const boatTypes = [
  {
    id: "racer",
    label: "Racer",
    image: "/assets/images/filter/racing.png",
    // description: "High-performance racing yachts"
  },
  {
    id: "cruiser",
    label: "Cruiser",
    image: "/assets/images/filter/cruising.png",
    // description: "Comfortable cruising yachts"
  },
  {
    id: "charter",
    label: "Charter",
    image: "/assets/images/filter/charter.jpg",
    // description: "Charter-ready vessels"
  }
];

const TopFilter = () => {
  const dispatch = useAppDispatch();
  const { boatType } = useAppSelector((state) => state.filter);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(boatType || []);

  useEffect(() => {
    setSelectedTypes(boatType || []);
  }, [boatType]);

  const handleTypeClick = (typeId: string) => {
    let newSelectedTypes: string[];
    
    if (selectedTypes.includes(typeId)) {
      // Deselect if already selected
      newSelectedTypes = selectedTypes.filter(t => t !== typeId);
    } else {
      // Add to selection
      newSelectedTypes = [...selectedTypes, typeId];
    }
    
    setSelectedTypes(newSelectedTypes);
    dispatch(setBoatType(newSelectedTypes));
  };

  return (
    <div className='breadcrumbs-section top-filter-section'>
      <div className="top-filter-background">
        <Image
          src="/assets/images/hero/main2.png"
          alt="Exelero Yachting"
          fill
          className="top-filter-bg-image"
          priority
          style={{ objectFit: "cover" }}
        />
        <div className="top-filter-overlay"></div>
      </div>
      <Container>
        <div className='breadcrumbs-main'>
          <div className='boat-type-filter'>
            <h2 className="filter-title">Brokerage & Charter</h2>
            <div className="d-flex justify-content-center align-items-center gap-4">
              {boatTypes.map((type) => (
                <div
                  key={type.id}
                  className={`boat-type-card ${selectedTypes.includes(type.id) ? 'selected' : ''}`}
                  onClick={() => handleTypeClick(type.id)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleTypeClick(type.id);
                    }
                  }}
                >
                  <div className="boat-type-image">
                    <Image
                      src={type.image}
                      alt={type.label}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                    <div className="boat-type-overlay"></div>
                    <div className="boat-type-content">
                      <h5>{type.label}</h5>
                    </div>
                    {selectedTypes.includes(type.id) && (
                      <div className="selected-overlay">
                        <i className="ri-check-line" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
      <ParticleComponent />
    </div>
  );
};

export default TopFilter;
