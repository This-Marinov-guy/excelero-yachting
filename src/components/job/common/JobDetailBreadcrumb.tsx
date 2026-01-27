import { ApplyNow, BreadCrumbListTitle, ImagePath, SVGPath } from "@/constants";
import { BreadcrumbDetail, DetailBreadCrumb, SocialIcons } from "@/data/job";
import RatioImage from "@/utils/RatioImage";
import { RouteList } from "@/utils/RouteList";
import Image from "next/image";
import Link from "next/link";
import React, { FC, Fragment } from "react";
import { Col, Container, Row } from "reactstrap";
import { ChevronsRight } from "lucide-react";

const JobDetailBreadcrumb: FC<{ detailType?: string }> = ({ detailType }) => {
  return (
    <Fragment>
      {detailType === "detail-2" ? (
        <div className='job-breadcrumbs-section'>
          <RatioImage src={`${ImagePath}/job/bg-effect/detail-breadcrumbs.jpeg`} alt='detail-breadcrumbs' className='bg-img' />
        </div>
      ) : detailType === "detail-3" ? (
        <div className='job-breadcrumbs-section breadcrumbs-style-1'>
          <Container>
            <h2>{BreadCrumbListTitle}</h2>
            <ul className='breadcrumb-list'>
              {BreadcrumbDetail.map((item, i) => (
                <li key={i}>{item}</li>
              ))}              
            </ul>
            <ul className='social-list'>
              {SocialIcons.map((item, i) => {
                return (
                  <li key={i}>
                    <Link href={item.url} target='_blank'>
                      {item.icon}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Container>
        </div>
      ) : detailType === "detail-4" ? (
        <div className='job-breadcrumbs-section'>
          <Container>
            <h2>{BreadCrumbListTitle}</h2>
            <ul className='breadcrumb-list'>
              {BreadcrumbDetail.map((item, i) => (
                <li key={i}>{item}</li>
              ))}              
            </ul>
          </Container>
        </div>
      ) : (
        <div className='breadcrumbs-style-2'>
          <Container>
            <Row className='mx-auto'>
              <Col xl={7} lg={6} className='p-0'>
                <div className='breadcrumbs-content'>
                  <ul className='breadcrumb-type-list'>
                    <li>Home</li>
                    <li>
                      <ChevronsRight className='h-4 w-4' />
                    </li>
                    <li>Collection</li>
                    <li>
                      <ChevronsRight className='h-4 w-4' />
                    </li>
                    <li>Single-job</li>
                  </ul>
                  <h2>{BreadCrumbListTitle}</h2>
                  <p>We’re excited to announce that we’re looking for a talented Business Development to join our fun, transparent, and collaborative team!</p>
                  <Link href={RouteList.Pages.Other.ContactUs1} className='btn-solid'>
                    {ApplyNow}
                  </Link>
                  <ul className='info-list'>
                    {DetailBreadCrumb.map((item, i) => (
                      <li key={i}>
                        <Image height={30} width={30} src={`${SVGPath}/${item.icon}`} alt={item.alt} className='img-fluid' />
                        <div>
                          <span>{item.title}</span>
                          <h5>{item.content}</h5>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
              <Col xl={5} lg={6} className='d-lg-block d-none p-0'>
                <div className='breadcrumbs-img'>
                  <RatioImage src={`${ImagePath}/job/home/detail-breadcrumbs-img.jpeg`} alt='detail-breadcrumbs-img' className='img-fluid' />
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </Fragment>
  );
};

export default JobDetailBreadcrumb;
