import React, { useState,useRef, useEffect } from "react";
import "./Personaldetails.css";
import { Button } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";
import axios from "axios";
import * as yup from "yup"
import { ErrorMessage, Formik } from "formik";
import Swal from "sweetalert2";
const Form = () => {
 
  const filephotoInputRef = useRef(null);
  let filesignatureInputRef=useRef(null);

  const [formDetails, setFormDetails] = useState({
    personalDetails: {
      name: "",
      fathersName: "",
      photo: null,
      caddress: "",
      permenantAddress: "",
      doj: "",
      mobile: "",
      email: "",
      dob: "",
      empid: "",
      bg: "",
      pan: "",
      aadhar: "",
      emergencyContact: "",
      relation: "",
      contactno: "",
      coursetiming:"",
      referencepersonname:"",
      referencecontact:""
    },
    educationQualification: [
      { degree: "", university: "", from: "", to: "", percentage: "" },
    ],
    workExperience: [
      { organization: "", designation: "", yearsofmonths: "", salary: "" },
    ],
    familyDetails: [{ name: "", age: "", work: "", address: "" }],
    courseDetails: [{ name: "", duration: "", fee: "" }],
    declaration: {isChecked: false, date: new Date().toISOString().split('T')[0], place: "", signature: null },
  });

  const schema = yup.object().shape({
    personalDetails: yup.object().shape({
      name: yup.string().required("Name is required"),
      fathersName: yup.string().required("Father's Name is required"),
      photo: yup.mixed().required("Photo is required"),
      permenantAddress: yup.string().required("Permanent address is required"),
      doj: yup.date().required("DOJ is required"),
      mobile: yup.string()
        .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits")
        .required("Mobile number is required"),
      email: yup.string().email("Email is invalid").required("Email is required"),
      dob: yup.date().required("DOB is required"),
      bg: yup.string().required("Blood group is required"),
      // pan: yup.string()
      //   .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "PAN is invalid")
      //   .required("PAN is required"),
      aadhar: yup.string()
        .matches(/^[0-9]{12}$/, "Aadhar number must be exactly 12 digits")
        .required("Aadhar is required"),
      emergencyContact: yup.string()
        .matches(/^[0-9]{10}$/, "Emergency contact must be exactly 10 digits")
        .required("Emergency contact is required"),
      relation: yup.string().required("Relation is required"),
      contactno: yup.string()
        .matches(/^[0-9]{10}$/, "Contact No must be exactly 10 digits")
        .required("Contact No is required"),
    }),
    educationQualification: yup.array().of(
      yup.object().shape({
        degree: yup.string().required("Degree is required"),
        university: yup.string().required("University is required"),
        from: yup.string().required("From  is required"),
        to: yup.string().required("To  is required"),
        percentage: yup.number()
          .min(0, "Percentage cannot be less than 0")
          .max(100, "Percentage cannot be more than 100")
          .required("Percentage is required"),
      })
    ),
    courseDetails: yup.array().of(
      yup.object().shape({
        name: yup.string().required("Course name is required"),
        duration: yup.string().required("Course duration is required"),
        fee: yup.number().required("Course fee is required"),
      })
    ),
    declaration: yup.object({
      isChecked: yup.bool().oneOf([true], 'You must agree to the declaration').required('Required'),
      signature: yup.mixed().required("Signature is required"),
      date: yup.string().required("Date is required"),
      place: yup.string().required("Place is required"),
    }),
  });
  const handleInputChange = (section, field, value, index) => {
    if (index !== undefined) {
     
      setFormDetails((prev) => ({
        ...prev,
        [section]: prev[section].map((item, idx) =>
          idx === index ? { ...item, [field]: value } : item
        ),
      }));
    } else if (field === "photo" || field === "signature") {
   
      setFormDetails((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value[0], 
        },
      }));
    } else {
   
      setFormDetails((prev) => ({
        ...prev,
        [section]: { ...prev[section], [field]: value },
      }));
    }
  };
  
  const handleDeclarationChange = (field, value) => {
    if (field === "signature") {
      setFormDetails((prevFormDetails) => ({
        ...prevFormDetails,
        declaration: {
          ...prevFormDetails.declaration,
          [field]: value[0], 
        },
      }));
    } else {
      setFormDetails((prevFormDetails) => ({
        ...prevFormDetails,
        declaration: {
          ...prevFormDetails.declaration,
          [field]: value,
        },
      }));
    }
  };
  

  const addRow = (section) => {
    const newRow = section === "educationQualification"
      ? { degree: "", university: "", from: "", to: "", percentage: "" }
      : section === "workExperience"
      ? { organization: "", designation: "", yearsofmonths: "", salary: "" }
      : section === "familyDetails"
      ? { name: "", age: "", work: "", address: "" }
      : { name: "", duration: "", fee: "" };

    setFormDetails((prev) => ({
      ...prev,
      [section]: [...prev[section], newRow],
    }));
  };

  const deleteRow = (section, index) => {
    setFormDetails((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, idx) => idx !== index),
    }));
  };
  const handleSubmit = () => {
    console.log(formDetails);
  
    let formData = new FormData();
  
    formData.append("name", formDetails.personalDetails.name);
    formData.append("fathername", formDetails.personalDetails.fathersName);
    formData.append("photo", formDetails.personalDetails.photo);
    formData.append("correspondenceAddress", formDetails.personalDetails.caddress);
    formData.append("permanentAddress", formDetails.personalDetails.permenantAddress);
    formData.append("dateofjoining", formDetails.personalDetails.doj);
    formData.append("mobile", formDetails.personalDetails.mobile);
    formData.append("emailId", formDetails.personalDetails.email);
    formData.append("dateofbirth", formDetails.personalDetails.dob);
    formData.append("employeeId", formDetails.personalDetails.empid);
    formData.append("bloodGroup", formDetails.personalDetails.bg);
    formData.append("pancardno", formDetails.personalDetails.pan);
    formData.append("aadharcardno", formDetails.personalDetails.aadhar);
    formData.append("emergencyContactName", formDetails.personalDetails.emergencyContact);
    formData.append("emergencyContactRelation", formDetails.personalDetails.relation);
    formData.append("emergencyContactNo", formDetails.personalDetails.contactno);
    formData.append("referenceName", formDetails.personalDetails.referencepersonname);
    formData.append("referenceContactNo", formDetails.personalDetails.referencecontact);
    formData.append("courseTiming", formDetails.personalDetails.coursetiming);
    formData.append("education", JSON.stringify(formDetails.educationQualification));
    formData.append("workExperience", JSON.stringify(formDetails.workExperience));
    formData.append("family", JSON.stringify(formDetails.familyDetails));
    formData.append("course", JSON.stringify(formDetails.courseDetails));
    formData.append("declaration", formDetails.declaration.isChecked);
    formData.append("date", formDetails.declaration.date);
    formData.append("place", formDetails.declaration.place);
    if (formDetails.declaration.signature) {
      formData.append("signature", formDetails.declaration.signature);
    }
    formData.append("createdBy", 1);
    for (let pair of formData.entries()) {
      console.log(pair[0] + ':', pair[1]);
    }
    axios.post("http://49.204.232.254:52/api/createIntern", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(res => {
      console.log(res.data);
      
      if (filephotoInputRef.current) {
        filephotoInputRef.current.value = ''; 
      }
      if(filesignatureInputRef.current){
        filesignatureInputRef.current.value=''
      }   
     })
 
    .catch(error => {
      console.error("error !", error);
    });
    Swal.fire({
      title: "Thank you!",
      text: "Your Details Saved Successfully!...",
      icon: "success"
    });
    setFormDetails({
      personalDetails: {
        name: "",
        fathersName: "",
        photo: null,
        caddress: "",
        permenantAddress: "",
        doj: "",
        mobile: "",
        email: "",
        dob: "",
        empid: "",
        bg: "",
        pan: "",
        aadhar: "",
        emergencyContact: "",
        relation: "",
        contactno: "",
        coursetiming:"",
        referencepersonname:"",
        referencecontact:""
      },
      educationQualification: [
        { degree: "", university: "", from: "", to: "", percentage: "" },
      ],
      workExperience: [
        { organization: "", designation: "", yearsofmonths: "", salary: "" },
      ],
      familyDetails: [{ name: "", age: "", work: "", address: "" }],
      courseDetails: [{ name: "", duration: "", fee: "" }],
      declaration: {isChecked: false, date: "", place: "", signature: null },
    });
  };
  
// useEffect(()=>{
//   console.log("rendering ...")
// },[formDetails])
  return (
    <div className="form-container">
      <h2 className="form-title">INTERNSHIP JOINING FORM</h2>
      <Formik 
      enableReinitialize 
      initialValues={formDetails}
      validationSchema={schema}
      onSubmit={handleSubmit}>

    {({handleSubmit,handleChange,values})=>(

  
<form onSubmit={handleSubmit} noValidate>
      {/* Personal Details */}
      <section className="section">
    <h3 className="section-title">PERSONAL DETAILS</h3>
    <div className="section-content">
      <div className="input-row">
        <label>Name: <span style={{ fontSize: '1.4em', color: 'red', fontWeight: 'bold' }}>*</span></label>
        <input type="text" name="personalDetails.name" value={formDetails.personalDetails.name}
               onChange={(e) => { handleInputChange("personalDetails", "name", e.target.value); handleChange(e); }} />
        <ErrorMessage component="div" name="personalDetails.name" className="text-danger" />

        <label>Father's Name:  <span style={{ fontSize: '1.4em', color: 'red', fontWeight: 'bold' }}>*</span></label>
        <input type="text" name="personalDetails.fathersName" value={formDetails.personalDetails.fathersName}
               onChange={(e) => { handleInputChange("personalDetails", "fathersName", e.target.value); handleChange(e); }} />
        <ErrorMessage component="div" name="personalDetails.fathersName" className="text-danger" />

        <label>Photo:  <span style={{ fontSize: '1.4em', color: 'red', fontWeight: 'bold' }}>*</span></label>
<input
  type="file"
  ref={filephotoInputRef}
  name="personalDetails.photo"
  onChange={(e) => {
    handleInputChange("personalDetails", "photo", e.target.files, undefined);handleChange(e)
  }}
/>
<ErrorMessage component="div" name="personalDetails.photo" className="text-danger" />
      </div>
      <div className="input-row">
        <label>Correspondence Address:  </label>
        <input type="text" name="personalDetails.caddress" value={formDetails.personalDetails.caddress}
               onChange={(e) => { handleInputChange("personalDetails", "caddress", e.target.value); handleChange(e); }} />
    
      </div>
      <div className="input-row">
        <label>Permanent Address:   <span style={{ fontSize: '1.4em', color: 'red', fontWeight: 'bold' }}>*</span></label>
        <input type="text" name="personalDetails.permenantAddress" value={formDetails.personalDetails.permenantAddress}
               onChange={(e) => { handleInputChange("personalDetails", "permenantAddress", e.target.value); handleChange(e); }} />
        <ErrorMessage component="div" name="personalDetails.permenantAddress" className="text-danger" />
      </div>
      <div className="input-row">
        <label>Date of Joining:   <span style={{ fontSize: '1.4em', color: 'red', fontWeight: 'bold' }}>*</span></label>
        <input type="date" name="personalDetails.doj" value={formDetails.personalDetails.doj}
               onChange={(e) => { handleInputChange("personalDetails", "doj", e.target.value); handleChange(e); }} />
        <ErrorMessage component="div" name="personalDetails.doj" className="text-danger" />

        <label>Mobile:    <span style={{ fontSize: '1.4em', color: 'red', fontWeight: 'bold' }}>*</span></label>
        <input type="tel" name="personalDetails.mobile" value={formDetails.personalDetails.mobile}
               onChange={(e) => { handleInputChange("personalDetails", "mobile", e.target.value); handleChange(e); }} />
        <ErrorMessage component="div" name="personalDetails.mobile" className="text-danger" />

        <label>Email ID:    <span style={{ fontSize: '1.4em', color: 'red', fontWeight: 'bold' }}>*</span></label>
        <input type="email" name="personalDetails.email" value={formDetails.personalDetails.email}
               onChange={(e) => { handleInputChange("personalDetails", "email", e.target.value); handleChange(e); }} />
        <ErrorMessage component="div" name="personalDetails.email" className="text-danger" />
      </div>
      <div className="input-row">
        <label>Date of Birth:     <span style={{ fontSize: '1.4em', color: 'red', fontWeight: 'bold' }}>*</span></label>
        <input type="date" name="personalDetails.dob" value={formDetails.personalDetails.dob}
               onChange={(e) => { handleInputChange("personalDetails", "dob", e.target.value); handleChange(e); }} />
        <ErrorMessage component="div" name="personalDetails.dob" className="text-danger" />

        <label>Employee ID:   </label>
        <input type="text" name="personalDetails.empid" value={formDetails.personalDetails.empid}
               onChange={(e) => { handleInputChange("personalDetails", "empid", e.target.value); handleChange(e); }} />
      

        <label>Blood Group:   <span style={{ fontSize: '1.4em', color: 'red', fontWeight: 'bold' }}>*</span></label>
        <input type="text" name="personalDetails.bg" value={formDetails.personalDetails.bg}
               onChange={(e) => { handleInputChange("personalDetails", "bg", e.target.value); handleChange(e); }} />
        <ErrorMessage component="div" name="personalDetails.bg" className="text-danger" />
      </div>
      <div className="input-row">
        <label>PAN Card No:</label>
        <input type="text" name="personalDetails.pan" value={formDetails.personalDetails.pan}
               onChange={(e) => { handleInputChange("personalDetails", "pan", e.target.value); handleChange(e); }} />
      

        <label>Aadhar Card No:    <span style={{ fontSize: '1.4em', color: 'red', fontWeight: 'bold' }}>*</span></label>
        <input type="text" name="personalDetails.aadhar" value={formDetails.personalDetails.aadhar}
               onChange={(e) => { handleInputChange("personalDetails", "aadhar", e.target.value); handleChange(e); }} />
        <ErrorMessage component="div" name="personalDetails.aadhar" className="text-danger" />
      </div>
      <div className="input-row">
        <label>Emergency Contact:    <span style={{ fontSize: '1.4em', color: 'red', fontWeight: 'bold' }}>*</span></label>
        <input type="text" name="personalDetails.emergencyContact" value={formDetails.personalDetails.emergencyContact}
               onChange={(e) => { handleInputChange("personalDetails", "emergencyContact", e.target.value); handleChange(e); }} />
        <ErrorMessage component="div" name="personalDetails.emergencyContact" className="text-danger" />

        <label>Relation:   <span style={{ fontSize: '1.4em', color: 'red', fontWeight: 'bold' }}>*</span></label>
        <input type="text" name="personalDetails.relation" value={formDetails.personalDetails.relation}
               onChange={(e) => { handleInputChange("personalDetails", "relation", e.target.value); handleChange(e); }} />
        <ErrorMessage component="div" name="personalDetails.relation" className="text-danger" />

        <label>Contact No:    <span style={{ fontSize: '1.4em', color: 'red', fontWeight: 'bold' }}>*</span></label>
        <input type="tel" name="personalDetails.contactno" value={formDetails.personalDetails.contactno}
               onChange={(e) => { handleInputChange("personalDetails", "contactno", e.target.value); handleChange(e); }} />
        <ErrorMessage component="div" name="personalDetails.contactno" className="text-danger" />
      </div>
      <div className="input-row">
      <label>Reference Person Name:   </label>
        <input type="text" name="personalDetails.referencepersonname" value={formDetails.personalDetails.referencepersonname}
               onChange={(e) => { handleInputChange("personalDetails", "referencepersonname", e.target.value); handleChange(e); }} />
        

        <label>Reference Person Contact:  </label>
        <input type="text" name="personalDetails.referencecontact" value={formDetails.personalDetails.referencecontact}
               onChange={(e) => { handleInputChange("personalDetails", "referencecontact", e.target.value); handleChange(e); }} />
       

        <label>Course Timing:     </label>
        <input type="tel" name="personalDetails.coursetiming" value={formDetails.personalDetails.coursetiming}
               onChange={(e) => { handleInputChange("personalDetails", "coursetiming", e.target.value); handleChange(e); }} />

      </div>
    </div>
  </section>

       {/* Educational Qualification */}
       <section className="section">
  <h3 className="section-title">EDUCATIONAL QUALIFICATION</h3>
  <table>
    <thead>
      <tr>
        <th>Degree  <span style={{ fontSize: '1.4em', color: 'red', fontWeight: 'bold' }}>*</span></th>
        <th>University/Institute  <span style={{ fontSize: '1.4em', color: 'red', fontWeight: 'bold' }}>*</span></th>
        <th>From  <span style={{ fontSize: '1.4em', color: 'red', fontWeight: 'bold' }}>*</span></th>
        <th>To <span style={{ fontSize: '1.4em', color: 'red', fontWeight: 'bold', paddingLeft:"20px" }}>*</span></th>
        <th>Percentage/Grade  <span style={{ fontSize: '1.4em', color: 'red', fontWeight: 'bold' }}>*</span></th>
        <th>Action<span style={{ fontSize: '1.4em', color: 'red', fontWeight: 'bold' }}>*</span></th>
      </tr>
    </thead>
    <tbody>
      {formDetails.educationQualification.map((row, index) => (
        <tr key={index}>
          <td> 
            <input
              type="text"
              placeholder="Degree"
              name={`educationQualification[${index}].degree`}
              value={row.degree}
              onChange={(e) => {
                handleInputChange("educationQualification", "degree", e.target.value, index);
                handleChange(e);
              }} 
            />
            <ErrorMessage component="div" name={`educationQualification[${index}].degree`} className="text-danger" />
          </td>
          <td>
            <input
              type="text"
              placeholder="University"
              name={`educationQualification[${index}].university`}
              value={row.university}
              onChange={(e) => {
                handleInputChange("educationQualification", "university", e.target.value, index);
                handleChange(e);
              }}
            />
            <ErrorMessage component="div" name={`educationQualification[${index}].university`} className="text-danger" />
          </td>
          <td>
            <input
              type="text"
              placeholder="From"
              name={`educationQualification[${index}].from`}
              value={row.from}
              onChange={(e) => {
                handleInputChange("educationQualification", "from", e.target.value, index);
                handleChange(e);
              }}
            />
            <ErrorMessage component="div" name={`educationQualification[${index}].from`} className="text-danger" />
          </td>
          <td>
            <input
              type="text"
              placeholder="To "
              name={`educationQualification[${index}].to`}
              value={row.to}
              onChange={(e) => {
                handleInputChange("educationQualification", "to", e.target.value, index);
                handleChange(e);
              }}
            />
            <ErrorMessage component="div" name={`educationQualification[${index}].to`} className="text-danger" />
          </td>
          <td>
            <input
              type="text"
              placeholder="Percentage/Grade"
              name={`educationQualification[${index}].percentage`}
              value={row.percentage}
              onChange={(e) => {
                handleInputChange("educationQualification", "percentage", e.target.value, index);
                handleChange(e);
              }}
            />
            <ErrorMessage component="div" name={`educationQualification[${index}].percentage`} className="text-danger" />
          </td>
          <td>
            <Button variant="danger" onClick={() => deleteRow("educationQualification", index)}>
              <Trash />
            </Button>
          </td>
        </tr>
      ))}
      <tr>
        <td colSpan="6" style={{ textAlign: "center" }}>
          <Button variant="outline-primary" onClick={() => addRow("educationQualification")}>
            Add Row
          </Button>
        </td>
      </tr>
    </tbody>
  </table>
</section>


      {/* Work Experience */}
      <section className="section">
  <h3 className="section-title">WORK EXPERIENCE</h3>
  <table>
    <thead>
      <tr>
        <th>Organization</th>
        <th>Designation</th>
        <th>Period of Service (Years and Months)</th>
        <th>Salary</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {formDetails.workExperience.map((row, index) => (
        <tr key={index}>
          <td>
          <input
              type="text"
              placeholder="Organization"
              name={`workExperience[${index}].organization`}
              value={row.organization}
              onChange={(e) => {
                handleInputChange("workExperience", "organization", e.target.value, index);
                handleChange(e);
              }}
            />
           
          </td>
          <td>
            <input
              type="text"
              placeholder="Designation"
              name={`workExperience[${index}].designation`}
              value={row.designation}
              onChange={(e) => {
                handleInputChange("workExperience", "designation", e.target.value, index);
                handleChange(e);
              }}
            />
            
          </td>
          <td>
          <input
              type="text"
              placeholder="Period of Service (Years and Months)"
              name={`workExperience[${index}].yearsofmonths`}
              value={row.yearsofmonths}
              onChange={(e) => {
                handleInputChange("workExperience", "yearsofmonths", e.target.value, index);
                handleChange(e);
              }}
            />
           
          </td>
          <td>
            <input
              type="text"
              placeholder="Salary"
              name={`workExperience[${index}].salary`}
              value={row.salary}
              onChange={(e) => {
                handleInputChange("workExperience", "salary", Number(e.target.value), index);
                handleChange(e);
              }}
            />
      
          </td>
          <td>
            <Button variant="danger" onClick={() => deleteRow("workExperience", index)}>
              <Trash />
            </Button>
          </td>
        </tr>
      ))}
      <tr>
        <td colSpan="5" style={{ textAlign: "center" }}>
          <Button variant="outline-primary" onClick={() => addRow("workExperience")}>
            Add Row
          </Button>
        </td>
      </tr>
    </tbody>
  </table>
</section>
      {/* Family Details Section */}
      <section className="section">
  <h3 className="section-title">FAMILY DETAILS</h3>
  <table>
    <thead>
      <tr>
        <th>S.no</th>
        <th>Name of the person</th>
        <th style={{paddingLeft:"25px"}}>Age </th>
        <th style={{paddingLeft:"40px"}}>Work</th>
        <th style={{paddingLeft:"40px"}}>Address</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {formDetails.familyDetails.map((row, index) => (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>
            <input
              type="text"
              placeholder="Name"
              name={`familyDetails[${index}].name`}
              value={row.name}
              onChange={(e) => {
                handleInputChange("familyDetails", "name", e.target.value, index);
                handleChange(e);
              }}
            />
      
          </td>
          <td>
            <input
              type="number"
              placeholder="Age"
              name={`familyDetails[${index}].age`}
              value={row.age}
              onChange={(e) => {
                handleInputChange("familyDetails", "age", Number(e.target.value), index);
                handleChange(e);
              }}
            />
           
          </td>
          <td>
            <input
              type="text"
              placeholder="Work"
              name={`familyDetails[${index}].work`}
              value={row.work}
              onChange={(e) => {
                handleInputChange("familyDetails", "work", e.target.value, index);
                handleChange(e);
              }}
            />
          
          </td>
          <td>
            <input
              type="text"
              placeholder="Address"
              name={`familyDetails[${index}].address`}
              value={row.address}
              onChange={(e) => {
                handleInputChange("familyDetails", "address", e.target.value, index);
                handleChange(e);
              }}
            />
        
          </td>
          <td>
            <Button variant="danger" onClick={() => deleteRow("familyDetails", index)}>
              <Trash />
            </Button>
          </td>
        </tr>
      ))}
      <tr>
        <td colSpan="6" style={{ textAlign: "center" }}>
          <Button variant="outline-primary" onClick={() => addRow("familyDetails")}>
            Add Row
          </Button>
        </td>
      </tr>
    </tbody>
  </table>
</section>

      {/* Course Details Section */}
      <section className="section">
  <h3 className="section-title">COURSE DETAILS</h3>
  <table>
    <thead>
      <tr>
        <th>S.no</th>
        <th>Course Name  <span style={{ fontSize: '1.4em', color: 'red', fontWeight: 'bold' }}>*</span></th>
        <th>Course Duration <span style={{ fontSize: '1.4em', color: 'red', fontWeight: 'bold' }}>*</span></th>
        <th>Course Fee <span style={{ fontSize: '1.4em', color: 'red', fontWeight: 'bold' }}>*</span></th>
        <th>Action<span style={{ fontSize: '1.4em', color: 'red', fontWeight: 'bold' }}>*</span></th>
      </tr>
    </thead>
    <tbody>
      {formDetails.courseDetails.map((row, index) => (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>
          <input
              type="text"
              placeholder="Course Name"
              name={`courseDetails[${index}].name`}
              value={row.name}
              onChange={(e) => {
                handleInputChange("courseDetails", "name", e.target.value, index);
                handleChange(e);
              }}
            />
            <ErrorMessage component="div" name={`courseDetails[${index}].name`} className="text-danger" />
          </td>
          <td>
          <input
              type="text"
              placeholder="Course Duration"
              name={`courseDetails[${index}].duration`}
              value={row.duration}
              onChange={(e) => {
                handleInputChange("courseDetails", "duration", e.target.value, index);
                handleChange(e);
              }}
            />
            <ErrorMessage component="div" name={`courseDetails[${index}].duration`} className="text-danger" />
          </td>
          <td>
          <input
              type="text"
              placeholder="Course Fee"
              name={`courseDetails[${index}].fee`}
              value={row.fee}
              onChange={(e) => {
                handleInputChange("courseDetails", "fee", Number(e.target.value), index);
                handleChange(e);
              }}
            />
            <ErrorMessage component="div" name={`courseDetails[${index}].fee`} className="text-danger" />
          </td>
          <td>
            <Button variant="danger" onClick={() => deleteRow("courseDetails", index)}>
              <Trash />
            </Button>
          </td>
        </tr>
      ))}
      <tr>
        <td colSpan="5" style={{ textAlign: "center" }}>
          <Button variant="outline-primary" onClick={() => addRow("courseDetails")}>
            Add Row
          </Button>
        </td>
      </tr>
    </tbody>
  </table>
</section>
<div className="terms-container">
  <h2>TERMS AND CONDITIONS</h2>
  <p>During the internship period, the interns shall have the responsibility of performing the following terms and conditions:</p>
  <ul>
    <li><strong>Taking leaves</strong> won’t extend the tenure. Please avoid taking leaves.</li>
    <li>Attendance is considered mandatory.</li>
    <li>Late coming will be registered.</li>
    <li>The period of a break for lunch is from 1:30 PM to 2:30 PM.</li>
    <li>Dress code: Semi-formals and shoes.</li>
    <li>Taking leave or late login should be informed to the mentioned number: <span className="phone-number">7604949035</span> and must get approved.</li>
    <li>The course fee must be made within the mentioned period.</li>
    <li>Tasks must be completed within the target period, or else marks will be reduced.</li>
    <li>Feedback forms should be filled out on a weekly basis to ensure improvement in course training.</li>
    <li>The mode of communication should be in English inside the working area for communication development. If failed, marks will be reduced.</li>
    <li>Overall marks must be 7.5/10 or above to receive the completion certificate.</li>
  </ul>
</div>

 {/* Declaration */}
      <section className="section declaration-section">
  <p>
    <input
      type="checkbox"
      name="declaration.isChecked"
      checked={formDetails.declaration.isChecked}
      onChange={(e) => {
        handleDeclarationChange("isChecked", e.target.checked);
        handleChange(e);
      }}
    />{" "} 
    I declare that the above statements made in my joining form are true,
    complete, and correct to the best of my knowledge and belief.
  </p>
  <ErrorMessage component="div" name="declaration.isChecked" className="text-danger" />

  <div className="declaration-fields">
    <div className="input-row">
      <div className="input-column">
        <label>Date:  </label>
        <input
          type="date"
          name="declaration.date"
          value={formDetails.declaration.date}
          onChange={(e) => {
            handleDeclarationChange("date", e.target.value);
            handleChange(e);
          }}
        />
        <ErrorMessage component="div" name="declaration.date" className="text-danger" />
      </div>
      <div className="input-column">
        <label>Place:  <span style={{ fontSize: '1.4em', color: 'red', fontWeight: 'bold' }}>*</span></label>
        <input
          type="text"
          name="declaration.place"
          value={formDetails.declaration.place}
          onChange={(e) => {
            handleDeclarationChange("place", e.target.value);
            handleChange(e);
          }}
        />
        <ErrorMessage component="div" name="declaration.place" className="text-danger" />
      </div>
      <div className="input-column">
      <label>Signature:  <span style={{ fontSize: '1.4em', color: 'red', fontWeight: 'bold' }}>*</span></label>
<input
  type="file"
  ref={filesignatureInputRef}
  name="declaration.signature" // Ensure this matches the name used in your form's initial values and validation schema
  onChange={(e) => {
    handleDeclarationChange("signature", e.target.files,undefined);handleChange(e)
  }}
/>
<ErrorMessage component="div" name="declaration.signature" className="text-danger" />

      </div>
    </div>
  </div>
</section>
      <br/>
      <Button variant="outline-success" type="submit">Save details</Button>
      </form>
        )}
      </Formik>
    </div>
  );
};

export default Form;
