// testModel.js
import prisma from "../prisma/prisma.js";

const fullTestSelect = {
  id: true,
  userId: true,

  pa1: true, pa2: true, pa3: true, pa4: true, pa5: true,
  pa6: true, pa7: true, pa8: true, pa9: true, pa10: true,
  pa11: true, pa12: true, pa13: true, pa14: true, pa15: true,
  pa16: true, pa17: true, pa18: true, pa19: true, pa20: true,

  pb1: true, pb2: true, pb4: true, pb5: true, pb6: true, pb7: true,

  pc1: true, pc2: true, pc3: true, pc4: true, pc5: true, pc6: true, pc7: true,

  notea1: true, notea2: true, notea3: true, notea4: true, notea5: true,
  notea6: true, notea7: true, notea8: true, notea9: true, notea10: true,
  notea11: true, notea12: true, notea13: true, notea14: true, notea15: true,
  notea16: true, notea17: true, notea18: true, notea19: true, notea20: true,

  noteb1: true, noteb2: true, noteb4: true, noteb5: true, noteb6: true, noteb7: true,

  notec1: true, notec2: true, notec3: true, notec4: true, notec5: true, 
  notec6: true, notec7: true
};


class TestModel {

  //---------------------------------------------------------
  // 1. Create an EMPTY test (initialize at the beginning of the test)
  //---------------------------------------------------------
  async createInitialTest(userId) {
    return prisma.test.create({
      data: {
        userId,

        // First 3 parts are empty at the beginning
        pa1: false, pa2: false, pa3: false, pa4: false, pa5: false,
        pa6: false, pa7: false, pa8: false, pa9: false, pa10: false,
        pa11: false, pa12: false, pa13: false, pa14: false, pa15: false,
        pa16: false, pa17: false, pa18: false, pa19: false, pa20: false,

        pb1: false, pb2: false, pb4: false, pb5: false, pb6: false,
        pb7: "",

        pc1: "", pc2: "", pc3: "", pc4: "", pc5: "", pc6: "", pc7: "",

        // notes auto = 0, notes admin = 0
        notea1: 0, notea2: 0, notea3: 0, notea4: 0, notea5: 0,
        notea6: 0, notea7: 0, notea8: 0, notea9: 0, notea10: 0,
        notea11: 0, notea12: 0, notea13: 0, notea14: 0, notea15: 0,
        notea16: 0, notea17: 0, notea18: 0, notea19: 0, notea20: 0,

        noteb1: 0, noteb2: 0, noteb4: 0, noteb5: 0, noteb6: 0, noteb7: 0,

        notec1: 0, notec2: 0, notec3: 0, notec4: 0, notec5: 0, notec6: 0, notec7: 0
      },
      select: fullTestSelect
    });
  }


  //---------------------------------------------------------
  // 2. Retrieve ALL tests of a user (a user can have many tests)
  //---------------------------------------------------------
  async getTestsByUserId(userId) {
    return prisma.test.findMany({
      where: { userId },
      select: fullTestSelect
    });
  }


  //---------------------------------------------------------
  // 3. Update answers (user updates the QCM / video / open questions)
  //---------------------------------------------------------
  async updateAnswers(testId, data) {
    return prisma.test.update({
      where: { id: testId },
      data,
      select: fullTestSelect
    });
  }


  //---------------------------------------------------------
  // 4. Grade automatically part 1 + part 2
  //---------------------------------------------------------
  async gradeAuto(testId, data) {
    // data = { notea1, notea2, ..., noteb7 }
    return prisma.test.update({
      where: { id: testId },
      data,
      select: fullTestSelect
    });
  }


  //---------------------------------------------------------
  // 5. Grade manually part 3 (admin)
  //---------------------------------------------------------
  //Need role.user = "ADMIN" or role.user = "SUPERADMIN"
  async gradeManual(testId, data) {
    // data = { notec1, notec2, ..., notec7 }
    return prisma.test.update({
      where: { id: testId },
      data,
      select: fullTestSelect
    });
  }


}

export default new TestModel();
