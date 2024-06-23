export const createAppraise = async (values) => {
  try {
    const res = await fetch(`http://localhost:3000/api/appraiseGrade`, {
      method: "POST",
      body: JSON.stringify(values),
    });

    if (res) {
      return res.json();
    }
  } catch (error) {
    return error;
  }
};

export const getAppraiseGradeById = async (id) => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/appraiseGrade?id=${id}`,
      {
        method: "GET",
        cache: "no-cache",
      }
    );
    if (res) {
      return res.json();
    }
  } catch (error) {
    return error;
  }
};

export const getAppraiseGradeByTopicId = async (topicId, appraisalBoardId) => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/appraiseGrade?topicId=${topicId}&appraisalBoardId=${appraisalBoardId}`,
      {
        method: "GET",
        cache: "no-cache",
      }
    );
    if (res) {
      return res.json();
    }
  } catch (error) {
    return error;
  }
};

export const deleteAppraiseGradeByTopicId = async (
  topicId,
  appraisalBoardId
) => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/appraiseGrade?topicId=${topicId}&appraisalBoardId=${appraisalBoardId}`,
      {
        method: "DELETE",
      }
    );

    if (res) {
      return res.json();
    }
  } catch (error) {
    return error;
  }
};
