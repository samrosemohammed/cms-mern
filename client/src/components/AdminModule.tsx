import { Button } from "./Button";
import { EllipsisVertical } from "lucide-react";
import moduleBanner from "../assets/module-banner.jpg"; // Adjust the path as necessary
import { OptionBox } from "./OptionBox";
import { Loader } from "./Loader";
import { SystemForm } from "./SystemForm";
import { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import { FeedBack } from "./FeedBack";

export const AdminModule = () => {
  const moduleFields = [
    {
      label: "Enter Module Name",
      type: "text",
      name: "moduleName",
      id: "moduleName",
    },
    {
      label: "Module ID",
      type: "text",
      name: "moduleID",
      id: "moduleID",
    },
    {
      label: "Start Date",
      type: "date",
      name: "moduleDate",
      id: "moduleDate",
    },
    {
      label: "End Date",
      type: "date",
      name: "moduleEndDate",
      id: "moduleEndDate",
    },
  ];

  const [isFormVisibile, setFormVisible] = useState(false);
  const [selectedModuleID, setSelectedModuleID] = useState<String | null>(null);
  const [clickedModuleData, setClickedModuleData] = useState({});
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [serverMessage, setSeverMessage] = useState("");
  const typeFields = ["Edit", "Assign", "Delete"];

  console.log("Server Message Recieved : ", serverMessage);
  const handleCreateModule = () => {
    setFormVisible(true);
  };

  const handleCloseForm = () => {
    setFormVisible(false);
  };

  const handleOptionClick = (
    moduleID: string,
    moduleName: string,
    moduleCode: string,
    moduleDate: string,
    moduleEndDate: string
  ) => {
    setSelectedModuleID((prevState) =>
      prevState === moduleCode ? null : moduleCode
    );
    moduleDate = moment(moduleDate).format("YYYY-MM-DD");
    moduleEndDate = moment(moduleEndDate).format("YYYY-MM-DD");
    console.log(moduleDate);
    setClickedModuleData({
      moduleID,
      moduleName,
      moduleCode,
      moduleDate,
      moduleEndDate,
    });
    console.log("Clicked Module Data:", clickedModuleData);
  };

  const fetchModules = async () => {
    setIsLoading(true); // Set loading to true before fetching
    try {
      const response = await axios.get(
        "http://localhost:5000/api/admin-dashboard/module",
        {
          withCredentials: true,
        }
      );
      setModules(response.data);
      console.log(response.data.message);
      console.log(response.data);
      setIsLoading(false); // Set loading to false after fetching
    } catch (err) {
      console.error("Error fetching modules:", err);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  return (
    <>
      {isLoading && <Loader />} {/* Show loader when loading */}
      {serverMessage && <FeedBack message={serverMessage} />}
      <section className="">
        {isFormVisibile && (
          <SystemForm
            fields={moduleFields}
            useGrid={false}
            onClose={handleCloseForm}
            submitUrl="http://localhost:5000/api/admin-dashboard/module"
            serverMessageFromForm={setSeverMessage}
            fetchData={fetchModules}
          />
        )}
        <div className="flex justify-between items-center">
          <div></div>
          <Button onClick={handleCreateModule} type="Create Module" />
        </div>
        <div className="module-div grid grid-cols-3 gap-6">
          {modules.map((modulee: any) => (
            <div key={modulee._id} className="bg-slate-800 rounded">
              <img
                className="rounded-t"
                src={moduleBanner}
                alt="Module Banner Image"
              />
              <div className="space-y-3 p-4 text-slate-300">
                <div className="flex justify-between items-center relative">
                  {selectedModuleID === modulee._id && (
                    <OptionBox
                      type={typeFields}
                      moduleData={clickedModuleData}
                      setServerMessage={setSeverMessage}
                      closeOptionBox={() => setSelectedModuleID(null)} // pass close function to the option box
                      fetchModules={fetchModules} // Pass fetchModules to OptionBox
                    />
                  )}
                  <h2 className="text-[20px]">{modulee.moduleName}</h2>
                  <EllipsisVertical
                    size={28}
                    onClick={() =>
                      handleOptionClick(
                        modulee.moduleID,
                        modulee.moduleName,
                        modulee._id,
                        modulee.moduleDate,
                        modulee.moduleEndDate
                      )
                    }
                    className="cursor-pointer hover:bg-slate-700 rounded-full"
                  />
                </div>
                <p className="module-code text-[16px] text-slate-300">
                  {modulee.moduleID}
                </p>
                <div className="flex justify-between items-center text-[14px] text-slate-400">
                  <p>{new Date(modulee.moduleDate).toLocaleDateString()}</p>
                  <p>{new Date(modulee.moduleEndDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};
