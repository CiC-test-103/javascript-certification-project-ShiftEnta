// Necessary Imports (you will need to use this)
const { Student } = require("./Student");
const fs = require("fs").promises;

/**
 * Node Class (GIVEN, you will need to use this)
 */
class Node {
  // Public Fields
  data; // Student
  next; // Object
  /**
   * REQUIRES:  The fields specified above
   * EFFECTS:   Creates a new Node instance
   * RETURNS:   None
   */
  constructor(data, next = null) {
    this.data = data;
    this.next = next;
  }
}

/**
 * Create LinkedList Class (for student management)
 * The class should have the public fields:
 * - head, tail, length
 */
class LinkedList {
  // Public Fields
  head; // Object
  tail; // Object
  length; // Number representing size of LinkedList

  /**
   * REQUIRES:  None
   * EFFECTS:   Creates a new LinkedList instance (empty)
   * RETURNS:   None
   */
  constructor() {
    // TODO
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  /**
   * REQUIRES:  A new student (Student)
   * EFFECTS:   Adds a Student to the end of the LinkedList
   * RETURNS:   None
   * CONSIDERATIONS:
   * - Think about the null case
   * - Think about adding to the 'end' of the LinkedList (Hint: tail)
   */
  addStudent(newStudent) {
    // TODO
    let node = new Node(newStudent);
    //? updating tail and head
    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node; //?(to point to the next node)
      this.tail = node; //? (to set the curent tail to node)
    }
    this.length++;
  }

  /**
   * REQUIRES:  email(String)
   * EFFECTS:   Removes a student by email (assume unique)
   * RETURNS:   None
   * CONSIDERATIONS:
   * - Think about the null case
   * - Think about how removal might update head or tail
   */
  removeStudent(email) {
    // TODO

    //?check if the linkedlist is empty
    if (!this.head) {
      return;
    }

    //?if the node to remove is the head
    if (this.head.data.getEmail() === email) {
      //move the head to the next node
      this.head = this.head.next;
      if (!this.head) {
        //?if the node had one element and its removed the tail has to be null
        this.tail = null;
      }
      this.length--;
      return;
    }

    //?loop through the list to find the node.data.email === email
    let current = this.head;
    //? looping to check if the next node has the same email
    while (current.next) {
      if (current.next.data.getEmail() === email) {
        //? if it is the same email update the head.next to head.next.next
        current.next = current.next.next;
        //?if this.current.next === null when node is the tail
        if (!current.next) {
          //? set the tail to the previous node
          this.tail = current;
        }
        this.length--;
        return;
      }
      //? this set current to the next node to keep the loop going
      current = current.next;
    }
  }

  /**
   * REQUIRES:  email (String)
   * EFFECTS:   None
   * RETURNS:   The Student or -1 if not found
   */
  findStudent(email) {
    //?loping so simlilar code as before but we start the loop from the head
    let current = this.head;
    while (current) {
      if (current.data.getEmail() === email) {
        return current.data;
      }
      //? to move to the next node
      current = current.next;
    }

    //? return -1 if the student is not found
    return -1;
  }

  /**
   * REQUIRES:  None
   * EFFECTS:   Clears all students from the Linked List
   * RETURNS:   None
   */
  clearStudents() {
    // TODO
    //?reseting all the nodes to null
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  /**
   * REQUIRES:  None
   * EFFECTS:   None
   * RETURNS:   LinkedList as a String for console.log in caller
   * CONSIDERATIONS:
   *  - Let's assume you have a LinkedList with two people
   *  - Output should appear as: "JohnDoe, JaneDoe"
   */
  displayStudents() {
    //? an array to store names
    let result = [];
    //? loop through the nodes and push each node to the result array
    let current = this.head;
    while (current) {
      result.push(current.data.getName());
      current = current.next; //? move to the next node
    }

    // TODO
    return result.join(", ");
  }

  /**
   * REQUIRES:  None
   * EFFECTS:   None
   * RETURNS:   A sorted array of students by name
   */
  #sortStudentsByName() {
    // TODO
    let students = [];
    let curent = this.head;
    while (curent) {
      students.push(curent.data);
      curent = curent.next;
    }
    //?sorts the arrayalphabetically
    return students.sort((a, b) => a.getName().localeCompare(b.getName()));
  }

  /**
   * REQUIRES:  specialization (String)
   * EFFECTS:   None
   * RETURNS:   An array of students matching the specialization, sorted alphabetically by student name
   * CONSIDERATIONS:
   * - Use sortStudentsByName()
   */
  filterBySpecialization(specialization) {
    // TODO
    let sortedStudents = this.#sortStudentsByName(); // Get sorted students
    return sortedStudents.filter(
      //callback function to filter the returned sorted array
      (student) => {
        return student.getSpecialization() === specialization;
      }
    );
  }

  /**
   * REQUIRES:  minAge (Number)
   * EFFECTS:   None
   * RETURNS:   An array of students who are at least minAge, sorted alphabetically by student name
   * CONSIDERATIONS:
   * - Use sortStudentsByName()
   */
  filterByMinYear(minYear) {
    // TODO
    let sortedStudents = this.#sortStudentsByName();

    //?filter the sorted student array by
    return sortedStudents.filter((student) => {
      student.getYear() >= minYear;
    });
  }

  /**
   * REQUIRES:  A valid file name (String)
   * EFFECTS:   Writes the LinkedList to a JSON file with the specified file name
   * RETURNS:   None
   */
  async saveToJson(fileName) {
    // TODO

    const students = []; // Initialize an empty array to store student objects
    let current = this.head; // Start at the head of the list
    while (current) {
      // Traverse the list
      students.push({
        name: current.data.getName(),
        year: current.data.getYear(),
        email: current.data.getEmail(),
        specialization: current.data.getSpecialization(),
      }); // Add the student object to the array
      current = current.next; // Move to the next node
    }
    await fs.writeFile(fileName, JSON.stringify(students, null, 2)); // Write to JSON f
  }

  /**
   * REQUIRES:  A valid file name (String) that exists
   * EFFECTS:   Loads data from the specified fileName, overwrites existing LinkedList
   * RETURNS:   None
   * CONSIDERATIONS:
   *  - Use clearStudents() to perform overwriting
   */
  async loadFromJSON(fileName) {
    // TODO
    // Read the JSON file
    const data = await fs.readFile(fileName, "utf-8");
    const students = JSON.parse(data); //? push JSON data into an array
    this.clearStudents(); // Clear the existing linked list
    students.forEach((student) =>
      this.addStudent(
        new Student(
          student.name,
          student.year,
          student.email,
          student.specialization
        )
      )
    ); // Add each student
  }
}

module.exports = { LinkedList };
