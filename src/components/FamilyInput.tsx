import React, { useState } from "react";

const FamilyInput = () => {
  const [familyCount, setFamilyCount] = useState<number>(0);

  const [familyDetails, setFamilyDetails] = useState([
    { gender: -1, age_group: -1 },
  ]);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleFamilyCountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const count = parseInt(e.target.value, 10);
    setFamilyCount(count);
    setFamilyDetails(
      Array.from(
        { length: count },
        (_, i) => familyDetails[i] || { gender: -1, age_group: -1 }
      )
    );
  };

  const handleGenderChange = (index, value) => {
    const newDetails = [...familyDetails];
    newDetails[index].gender = parseInt(value, 10);
    setFamilyDetails(newDetails);
  };

  const handleAgeGroupChange = (index, value) => {
    const newDetails = [...familyDetails];
    newDetails[index].age_group = parseInt(value, 10);
    setFamilyDetails(newDetails);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(JSON.stringify(familyDetails));

    // データをAPIにPOST
    try {
      const response = await fetch("http://localhost:8080/simulated-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(familyDetails),
      });

      if (!response.ok) {
        throw new Error("データの送信に失敗しました");
      }

      const result = await response.json();
      //setChecklistData(result); // CheckList用のデータを更新
      setFormSubmitted(true); // Set formSubmitted to true on successful submission
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  };

  const isFormComplete = () => {
    if (!familyCount) return false;
    return familyDetails.every(
      (detail) => detail.gender != -1 && detail.age_group != -1
    );
  };

  const scrollToSection = () => {
    const section = document.getElementById("checklist-container");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full p-8 red ounded-lg shadow-md">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="bg-white p-6 rounded-lg shadow-sm mt-5">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            あなたの家族の構成について教えてください
          </h2>
          <label
            htmlFor="family-count"
            className="block text-gray-700 font-medium mb-2"
          >
            家族は何人いますか？
          </label>
          <select
            id="family-count"
            placeholder="人数"
            type="number"
            min="1"
            max="10"
            value={familyCount || ""}
            onChange={handleFamilyCountChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          >
            <option value="">選択してください</option>
            {[...Array(10).keys()].map((num) => (
              <option key={num + 1} value={num + 1}>{`${num + 1}人`}</option>
            ))}
          </select>
        </div>
        {Array.from({ length: familyCount }, (_, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm mt-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {`${index + 1}人目の情報`}
            </h3>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <label
                  htmlFor={`gender-${index}`}
                  className="text-gray-700 font-medium"
                >
                  性別
                </label>
                <select
                  id={`gender-${index}`}
                  value={familyDetails[index]?.gender || ""}
                  onChange={(e) => handleGenderChange(index, e.target.value)}
                  required
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                >
                  <option value="">選択してください</option>
                  <option value="1">男性</option>
                  <option value="2">女性</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <label
                  htmlFor={`age-group-${index}`}
                  className="text-gray-700 font-medium"
                >
                  年代
                </label>
                <select
                  id={`age-group-${index}`}
                  value={familyDetails[index]?.age_group || ""}
                  onChange={(e) => handleAgeGroupChange(index, e.target.value)}
                  required
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                >
                  <option value="">選択してください</option>
                  <option value="1">乳幼児</option>
                  <option value="2">子供（3歳〜小6）</option>
                  <option value="3">中学生以上</option>
                  <option value="4">成人以上</option>
                  <option value="5">65歳以上</option>
                </select>
              </div>
            </div>
          </div>
        ))}
        {isFormComplete() && (
          <div className="text-right mt-6">
            <button
              className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition duration-300"
              type="submit"
              onClick={scrollToSection}
            >
              作成
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default FamilyInput;
