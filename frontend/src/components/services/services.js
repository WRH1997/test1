import React, { useState, useSelector } from "react";
import { Link } from "react-router-dom";
import Header from "../header/header";
import Footer from "../footer/footer";
import '../services/services.css';
import { Accordion, AccordionItem } from '@szhsin/react-accordion';


export default function Services() {

  const [services, setServices] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [filters, setFilters] = React.useState([]);
  const [filtered, setFiltered] = React.useState(false);
  const [searched, setSearched] = React.useState(false);

  //cleaning, repair, moving, carpentry, landscaping, other
  //const [filters, setFilters] = React.useState([]);

  const fetchData = async () => {
    let data = await fetch('http://localhost:3001/allServices', {
      method: "GET",
      headers: {
        "Content-Type": 'application/json'
      }
    });
    let serviceJson = await data.json();
    let serviceList = serviceJson['services'];
    if(JSON.stringify(services)!=JSON.stringify(serviceList)){
      return setServices(serviceList);
    }
  }

  React.useEffect(() => {
    if(filtered){
      return;
    }
    if(searched){
      return;
    }
    fetchData();
  }, services)


  const searchServices = async (event) =>{
    event.preventDefault();
    setSearched(true);
    let searchTerm = event.target.value;
    if(searchTerm==""){
      setSearched(false);
      fetchData();
      return;
    }
    let data = await fetch('http://localhost:3001/searchServices', {
      method: 'POST',
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({'searchTerm': searchTerm})
    });
    let serviceJson = await data.json();
    let serviceList = serviceJson['services'];
    if(JSON.stringify(services)!=JSON.stringify(serviceList)){
      return setServices(serviceList);
    }
  }

  const applyFilters = async (e) => {
    let newFilters = [];
    let elements = document.getElementsByClassName('fltrs');
    for(let x=0; x<elements.length; x++){
      if(elements[x].checked){
        newFilters.push(elements[x].value);
      }
    }
    if(newFilters.length==0){
      setFiltered(false);
      fetchData();
      return;
    }
    setFiltered(true);
    let data = await fetch('http://localhost:3001/filterServices', {
      method: 'POST',
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({'filters': newFilters})
    });
    let serviceJson = await data.json();
    let serviceList = serviceJson['services'];
    if(JSON.stringify(services)!=JSON.stringify(serviceList)){
      return setServices(serviceList);
    }
  }
   

  return (
    <div>  
      <Header currentPage="/services"  />

      <div className="bg-white">

      <center>
          <input type='text' className='search-bar' id='search-bar' onChange={searchServices}></input>
      </center>

      <div className='filters'>
      <Accordion className='fltrs-dropdown'>
        <AccordionItem header="Filters" className='accFltrs'>
        <input type='checkbox' id='cleaning' value='Cleaning' className='fltrs' onClick={applyFilters}></input> Cleaning 
        <br></br>
        <input type='checkbox' id='repair' value='Repair' className='fltrs' onClick={applyFilters}></input> Repair
        <br></br>
        <input type='checkbox' id='moving' value='Moving' className='fltrs' onClick={applyFilters}></input> Moving
        <br></br>
        <input type='checkbox' id='carpentry' value='Carpentry' className='fltrs' onClick={applyFilters}></input> Carpentry
        <br></br>
        <input type='checkbox' id='landscaping' value='Landscaping' className='fltrs' onClick={applyFilters}></input> Landscaping
        <br></br>
        <input type='checkbox' id='other' value='Other' className='fltrs' onClick={applyFilters}></input> Other
        <br></br><br></br>
        </AccordionItem>
      </Accordion>

      </div>
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {services?.map((service) => (
            <a className="service_card group p-2  decoration-white no-underline">
              <p style={{color: "inherit"}} className="mt-1 text-l font-medium text-gray-900">{service.serviceName}</p>
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                <img
                  style={{color: "inherit"}}
                  src={service.serviceImg}
                  alt={service.serviceName}
                  className="h-full w-full object-cover object-center group-hover:opacity-75"
                />
              </div>
              <h3 style={{color: "inherit"}} className="mt-4 text-sm text-gray-700">Vendor: {service.vendorName}</h3>
              <h3 style={{color: "inherit"}} className="text-sm text-gray-700">Location: {service.vendorLocation}</h3>
              <h3 style={{color: "inherit"}} className="text-sm text-gray-700">Category: {service.category}</h3>
              <p style={{color: "inherit"}} className="mt-1 text-lg font-medium text-gray-900">Rate: ${service.pricePerHour}/hr.</p>
              {service.serviceDesc}
            </a>
          ))}
        </div>
      </div>
    </div>
    
      <Footer/>
    </div>
  );
}
