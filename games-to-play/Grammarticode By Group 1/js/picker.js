// ===== Firebase Setup =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, where, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyBj7rTUxIubZSHkZKuvLwG98j8pKSsE76E",
    authDomain: "grammaticode.firebaseapp.com",
    projectId: "grammaticode",
    storageBucket: "grammaticode.firebasestorage.app",
    messagingSenderId: "272697038085",
    appId: "1:272697038085:web:e07cdfe23029840aeb536c"
};

// Init Firebase + Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ===== Quiz Data =====
const quizzes = {
    java: {
        easy: [
            { question: "What is the correct declaration of the main method in Java?", options: ["public static void main(String[] args)", "void main(String args[])", "main(String args[])", "public main(String[] args)"], answer: 0 },
            { question: "What is the output of: System.out.println(5/2)?", options: ["2.5", "2", "2.0", "Error"], answer: 1 },
            { question: "Which keyword is used to create an object?", options: ["new", "create", "make", "init"], answer: 0 },
            { question: "Which data type is used for whole numbers?", options: ["int", "double", "String", "char"], answer: 0 },
            { question: "Which symbol is used for comments?", options: ["//", "#", "<!-- -->", "--"], answer: 0 },
            { question: "Which class is used to print to the console?", options: ["System", "Console", "Print", "Output"], answer: 0 },
            { question: "What is the result of 10 % 3?", options: ["1", "3", "0", "10"], answer: 0 },
            { question: "Which keyword is used to declare a constant?", options: ["final", "static", "const", "lock"], answer: 0 },
            { question: "What is the data type of 'A'?", options: ["char", "String", "int", "boolean"], answer: 0 },
            { question: "Which operator is used for equality?", options: ["==", "=", "===", "equals"], answer: 0 },
            { question: "What is the default value of a boolean?", options: ["false", "true", "null", "0"], answer: 0 },
            { question: "What is the scope of a variable declared inside a method?", options: ["local", "global", "class", "package"], answer: 0 },
            { question: "Which keyword is used to create a subclass?", options: ["extends", "inherits", "super", "child"], answer: 0 },
            { question: "What is the purpose of the break statement?", options: ["stop the loop", "jump to next", "exit the program", "reset"], answer: 0 },
            { question: "Which is correct: Java is ___?", options: ["Object-Oriented", "Procedural only", "Assembly language", "Machine code"], answer: 0 }
        ],
        medium: [
            { question: "What is the default value of int in Java?", options: ["0", "null", "undefined", "error"], answer: 0 },
            { question: "Which keyword is related to polymorphism?", options: ["override", "super", "abstract", "interface"], answer: 0 },
            { question: "Which access modifier is the most restrictive?", options: ["private", "protected", "public", "default"], answer: 0 },
            { question: "What does JVM stand for?", options: ["Java Virtual Machine", "Java Verified Module", "Joint Virtual Method", "Java Version Manager"], answer: 0 },
            { question: "What is the process of hiding implementation details called?", options: ["Encapsulation", "Inheritance", "Polymorphism", "Overloading"], answer: 0 },
            { question: "Which method should be overridden for string representation?", options: ["toString()", "getString()", "valueOf()", "print()"], answer: 0 },
            { question: "What is the result of Integer.valueOf('123')?", options: ["Integer object", "123", "String", "Error"], answer: 0 },
            { question: "Which keyword is used for multiple inheritance of interfaces?", options: ["implements", "extends", "inherits", "uses"], answer: 0 },
            { question: "What is the default access modifier of class members?", options: ["package-private", "public", "private", "protected"], answer: 0 },
            { question: "Which collection allows duplicates?", options: ["ArrayList", "HashSet", "TreeSet", "LinkedHashSet"], answer: 0 },
            { question: "What is the result of 'abc'.charAt(1)?", options: ["b", "a", "c", "1"], answer: 0 },
            { question: "Which keyword is used for checked exceptions?", options: ["throws", "throw", "try", "catch"], answer: 0 },
            { question: "What is the size of char in Java?", options: ["2 bytes", "1 byte", "4 bytes", "8 bytes"], answer: 0 },
            { question: "Which method is used to compare strings?", options: ["equals()", "==", "compare()", "match()"], answer: 0 },
            { question: "What is the purpose of the static keyword?", options: ["belongs to class, not instance", "makes variable constant", "makes method private", "enables inheritance"], answer: 0 },
            { question: "Which loop is guaranteed to run at least once?", options: ["do-while", "while", "for", "enhanced for"], answer: 0 },
            { question: "What is the result of Math.ceil(4.3)?", options: ["5.0", "4.0", "4.3", "5"], answer: 0 },
            { question: "Which interface is used for sorting?", options: ["Comparable", "Comparator", "Sortable", "Ordered"], answer: 0 },
            { question: "What is the purpose of the super keyword?", options: ["refers to parent class", "makes class superior", "creates superclass", "enables polymorphism"], answer: 0 },
            { question: "Which method is used to get string length?", options: ["length()", "size()", "count()", "getLength()"], answer: 0 },
            { question: "What is the result of 'Hello'.substring(1,3)?", options: ["el", "ell", "He", "lo"], answer: 0 },
            { question: "Which keyword is used for abstract methods?", options: ["abstract", "virtual", "pure", "incomplete"], answer: 0 },
            { question: "What is the size of an int array int[5]?", options: ["5 elements", "4 elements", "6 elements", "depends"], answer: 0 },
            { question: "Which exception is for array index out of bounds?", options: ["ArrayIndexOutOfBoundsException", "IndexOutOfRangeException", "ArrayException", "BoundsException"], answer: 0 },
            { question: "What is the result of Boolean.parseBoolean('TRUE')?", options: ["true", "false", "TRUE", "Error"], answer: 0 }
        ],
        hard: [
            { question: "Which keyword is used for inheritance in Java?", options: ["extends", "implements", "inherit", "super"], answer: 0 },
            { question: "What is the difference between == and .equals()?", options: ["== compares reference, equals compares value", "They are the same", "equals is for numbers only", "== is for strings only"], answer: 0 },
            { question: "What is the output of Integer.parseInt('010')?", options: ["10", "8", "0", "Error"], answer: 0 },
            { question: "Which design pattern is used by the String class?", options: ["Immutable", "Singleton", "Factory", "Observer"], answer: 0 },
            { question: "What is the result of System.out.println('5' + 2)?", options: ["52", "7", "5 + 2", "Error"], answer: 0 },
            { question: "Which method is called when an object is garbage collected?", options: ["finalize()", "destroy()", "cleanup()", "dispose()"], answer: 0 },
            { question: "What is the maximum value of byte in Java?", options: ["127", "128", "255", "256"], answer: 0 },
            { question: "Which keyword is used for a non-static nested class?", options: ["inner", "nested", "private", "none"], answer: 3 },
            { question: "What is the result of 1.0/0.0 in Java?", options: ["Infinity", "Error", "NaN", "0"], answer: 0 },
            { question: "Which collection is thread-safe by default?", options: ["Vector", "ArrayList", "LinkedList", "HashMap"], answer: 0 },
            { question: "What is the purpose of the volatile keyword?", options: ["prevents caching", "makes variable constant", "enables inheritance", "optimizes performance"], answer: 0 },
            { question: "Which method is used to join threads?", options: ["join()", "wait()", "merge()", "combine()"], answer: 0 },
            { question: "What is the result of Character.isDigit('5')?", options: ["true", "false", "5", "Error"], answer: 0 },
            { question: "Which exception is for illegal thread operations?", options: ["IllegalThreadStateException", "ThreadException", "ConcurrencyException", "SynchronizationException"], answer: 0 },
            { question: "What is the size of long in Java?", options: ["8 bytes", "4 bytes", "2 bytes", "16 bytes"], answer: 0 },
            { question: "Which interface is for lambda expressions?", options: ["Functional Interface", "Lambda Interface", "Expression Interface", "Anonymous Interface"], answer: 0 },
            { question: "What is the result of Arrays.toString(new int[]{1,2,3})?", options: ["[1, 2, 3]", "{1, 2, 3}", "1,2,3", "Error"], answer: 0 },
            { question: "Which keyword is used for synchronization?", options: ["synchronized", "atomic", "concurrent", "parallel"], answer: 0 },
            { question: "What is the purpose of the transient keyword?", options: ["excludes from serialization", "makes temporary", "enables inheritance", "optimizes memory"], answer: 0 },
            { question: "Which method is used to get the current thread?", options: ["Thread.currentThread()", "Thread.getThread()", "Thread.this()", "Thread.active()"], answer: 0 },
            { question: "What is the result of Math.round(4.6)?", options: ["5", "4", "4.6", "5.0"], answer: 0 },
            { question: "Which collection is used for LIFO operations?", options: ["Stack", "Queue", "List", "Set"], answer: 0 },
            { question: "What is the purpose of the assert keyword?", options: ["debugging and testing", "error handling", "type checking", "optimization"], answer: 0 },
            { question: "Which method is used for deep copying?", options: ["clone()", "copy()", "duplicate()", "replicate()"], answer: 0 },
            { question: "What is the result of String.valueOf(null)?", options: ["'null'", "null", "Error", "empty string"], answer: 0 },
            { question: "Which keyword is used for enum declaration?", options: ["enum", "enumeration", "constant", "final"], answer: 0 },
            { question: "What is the purpose of the strictfp keyword?", options: ["strict floating point", "strict final point", "string format print", "static final private"], answer: 0 },
            { question: "Which method is used for string formatting?", options: ["String.format()", "String.printf()", "String.template()", "String.substitute()"], answer: 0 },
            { question: "What is the result of Integer.MAX_VALUE + 1?", options: ["Integer.MIN_VALUE", "Error", "Infinity", "MAX_VALUE"], answer: 0 },
            { question: "Which design pattern is used for object creation?", options: ["Factory", "Observer", "Strategy", "Command"], answer: 0 },
            { question: "What is the purpose of WeakReference?", options: ["allows garbage collection", "makes reference strong", "optimizes memory", "enables inheritance"], answer: 0 },
            { question: "Which method is used for concurrent operations?", options: ["synchronize", "lock", "atomic", "concurrent"], answer: 1 },
            { question: "What is the result of Collections.emptyList().add(1)?", options: ["UnsupportedOperationException", "true", "false", "Error"], answer: 0 },
            { question: "Which annotation is used for deprecated methods?", options: ["@Deprecated", "@Old", "@Obsolete", "@Legacy"], answer: 0 },
            { question: "What is the purpose of the Reflection API?", options: ["runtime inspection", "compile-time checking", "performance optimization", "memory management"], answer: 0 },
            { question: "Which method is used for stream operations?", options: ["stream()", "flow()", "iterate()", "process()"], answer: 0 },
            { question: "What is the result of Optional.empty().orElse('default')?", options: ["'default'", "empty", "null", "Error"], answer: 0 },
            { question: "Which keyword is used for the module system?", options: ["module", "package", "namespace", "library"], answer: 0 },
            { question: "What is the purpose of CompletableFuture?", options: ["asynchronous programming", "thread synchronization", "memory optimization", "error handling"], answer: 0 },
            { question: "Which operator is used for method references?", options: ["::", "->", "=>", "::>"], answer: 0 }
        ],
        impossible: [
            { question: "public ___ class Test { }", options: ["class", "interface", "enum", "record"], answer: 0 },
            { question: "int[] arr = new int[___];", options: ["5", "arr", "int", "len"], answer: 0 },
            { question: "for(int i=0; i<10; i___) { }", options: ["++", "+=", "--", "+1"], answer: 0 },
            { question: "if(str.___(\"abc\")) { }", options: ["equals", "==", "compare", "eq"], answer: 0 },
            { question: "System.out.___(\"Hi\");", options: ["println", "print", "printf", "write"], answer: 0 },
            { question: "try { } ___ (Exception e) { }", options: ["catch", "finally", "throw", "throws"], answer: 0 },
            { question: "List<String> list = new ArrayList___();", options: ["<>", "()", "{}", "[]"], answer: 0 },
            { question: "switch(x) { ___ 1: break; }", options: ["case", "if", "when", "switch"], answer: 0 },
            { question: "class A ___ B { }", options: ["extends", "implements", "import", "package"], answer: 0 },
            { question: "int x = ___(5.9);", options: ["(int)", "Integer", "cast", "parseInt"], answer: 0 },
            { question: "___(x > 0);", options: ["assert", "check", "verify", "if"], answer: 0 },
            { question: "Optional<String> o = Optional.___(\"hi\");", options: ["of", "get", "empty", "map"], answer: 0 },
            { question: "int sum = IntStream.range(1,10).___();", options: ["sum", "reduce", "collect", "count"], answer: 0 },
            { question: "Thread t = new Thread(___);", options: ["runnable", "run", "Runnable", "Thread"], answer: 2 },
            { question: "Path p = Paths.___(\"file.txt\");", options: ["get", "path", "open", "of"], answer: 0 },
            { question: "var list = List.___Of(\"a\", \"b\");", options: ["of", "list", "create", "asList"], answer: 0 },
            { question: "Map<K,V> map = new HashMap___();", options: ["<>", "()", "{}", "[]"], answer: 0 },
            { question: "record Point(int x, int y) ___;", options: ["{}", "();", "[]", ";"], answer: 3 },
            { question: "sealed class A ___ permits B,C { }", options: ["permits", "allows", "extends", "implements"], answer: 0 },
            { question: "CompletableFuture.runAsync(___);", options: ["() -> {}", "Runnable", "new Thread()", "task()"], answer: 0 },
            { question: "enum Day { MON, TUE, ___ }", options: ["WED", "FRI", "DAY", "END"], answer: 0 },
            { question: "String s = String.___(10);", options: ["valueOf", "copyValueOf", "format", "repeat"], answer: 1 },
            { question: "Integer i = Integer.___(\"42\");", options: ["parseInt", "valueOf", "decode", "get"], answer: 1 },
            { question: "Files.___(path);", options: ["exists", "delete", "readAllBytes", "write"], answer: 0 },
            { question: "Arrays.___(arr);", options: ["sort", "order", "arrange", "stream"], answer: 0 },
            { question: "Collections.___(list);", options: ["sort", "stream", "copy", "emptyList"], answer: 0 },
            { question: "LocalDate d = LocalDate.___();", options: ["now", "of", "parse", "today"], answer: 0 },
            { question: "StringBuilder sb = new StringBuilder().___(\"a\");", options: ["append", "add", "push", "put"], answer: 0 },
            { question: "Queue<String> q = new LinkedList<>(); q.___(\"x\");", options: ["add", "push", "offer", "enqueue"], answer: 0 },
            { question: "Stack<Integer> s = new Stack<>(); s.___(1);", options: ["push", "add", "offer", "insert"], answer: 0 },
            { question: "double r = Math.___(16);", options: ["sqrt", "pow", "abs", "round"], answer: 0 },
            { question: "long t = System.___();", options: ["currentTimeMillis", "nanoTime", "time", "clock"], answer: 0 },
            { question: "ExecutorService ex = Executors.___();", options: ["newFixedThreadPool", "newPool", "create", "builder"], answer: 0 },
            { question: "Scanner sc = new Scanner(System.___);", options: ["in", "out", "err", "console"], answer: 0 },
            { question: "URL url = new URL(\"http://x\"); url.open___();", options: ["Connection", "Stream", "Connect", "Socket"], answer: 0 },
            { question: "Random r = new Random(); r.___();", options: ["nextInt", "random", "gen", "rand"], answer: 0 },
            { question: "String s = s.___();", options: ["trim", "cut", "clear", "remove"], answer: 0 },
            { question: "Deque<Integer> d = new ArrayDeque<>(); d.___(1);", options: ["add", "offer", "push", "enqueue"], answer: 2 },
            { question: "Predicate<String> p = s -> s.___(\"a\");", options: ["contains", "has", "includes", "match"], answer: 0 },
            { question: "Function<Integer,String> f = String::___;", options: ["valueOf", "toString", "format", "copy"], answer: 0 },
            { question: "Stream.of(1,2,3).___(System.out::println);", options: ["forEach", "map", "peek", "print"], answer: 0 },
            { question: "Files.readString(Path.of(\"a.txt\"), StandardCharsets.___);", options: ["UTF_8", "ASCII", "UTF_16", "DEFAULT"], answer: 0 },
            { question: "String.format(\"%d\", ___);", options: ["10", "String", "\"10\"", "Integer"], answer: 0 },
            { question: "try(FileReader fr = new FileReader(\"a.txt\")) { ___ }", options: ["}", "{", "finally", "catch"], answer: 0 },
            { question: "s.___().forEach(System.out::println);", options: ["stream", "list", "map", "set"], answer: 0 },
            { question: "Class<?> c = String.___;", options: ["class", "Class", "TYPE", "C"], answer: 0 },
            { question: "double d = BigDecimal.ONE.___();", options: ["doubleValue", "toDouble", "asDouble", "parseDouble"], answer: 0 },
            { question: "Arrays.___(new int[]{1,2,3});", options: ["stream", "list", "set", "copy"], answer: 0 },
            { question: "Path p = Files.___(\"a.txt\");", options: ["createFile", "make", "touch", "open"], answer: 0 },
            { question: "Thread.sleep(___);", options: ["1000", "1s", "one", "millis"], answer: 0 },
            { question: "Socket s = new Socket(\"localhost\", ___);", options: ["8080", "80", "21", "22"], answer: 0 },
            { question: "HttpClient c = HttpClient.___();", options: ["newHttpClient", "create", "builder", "open"], answer: 0 },
            { question: "CompletableFuture.supplyAsync(() -> \"hi\").___();", options: ["join", "get", "wait", "block"], answer: 0 },
            { question: "Stream.iterate(0, n -> n+1).___(10);", options: ["limit", "take", "count", "size"], answer: 0 },
            { question: "Map.Entry<K,V> e : map.___()", options: ["entrySet", "keySet", "values", "entries"], answer: 0 },
            { question: "Path p = Paths.get(\"a\"); Files.___(p);", options: ["delete", "remove", "erase", "drop"], answer: 0 },
            { question: "UUID id = UUID.___();", options: ["randomUUID", "create", "gen", "of"], answer: 0 },
            { question: "Pattern p = Pattern.___(\"a.*\");", options: ["compile", "of", "regex", "match"], answer: 0 },
            { question: "Matcher m = p.___(\"abc\");", options: ["matcher", "match", "test", "find"], answer: 0 },
            { question: "boolean b = m.___();", options: ["find", "next", "has", "search"], answer: 0 },
            { question: "Stream.of(\"a\",\"b\").map(String::___);", options: ["toUpperCase", "upper", "capitalize", "format"], answer: 0 },
            { question: "char c = Character.___('a');", options: ["toUpperCase", "upper", "capitalize", "format"], answer: 0 }
        ]

    },

    html: {
        easy: [
            { question: "Which tag is used for the largest heading?", options: ["<h6>", "<h1>", "<head>", "<heading>"], answer: 1 },
            { question: "Which tag is used for a paragraph?", options: ["<p>", "<para>", "<pg>", "<text>"], answer: 0 },
            { question: "Which tag is used for a line break?", options: ["<br>", "<lb>", "<break>", "<line>"], answer: 0 },
            { question: "Which tag is used for an image?", options: ["<img>", "<image>", "<pic>", "<src>"], answer: 0 },
            { question: "Which attribute is used for image alt text?", options: ["alt", "title", "src", "desc"], answer: 0 },
            { question: "Which tag is used for an unordered list?", options: ["<ol>", "<ul>", "<li>", "<list>"], answer: 1 },
            { question: "Which tag is used for a table row?", options: ["<tr>", "<td>", "<th>", "<row>"], answer: 0 },
            { question: "Which tag is used for a hyperlink?", options: ["<a>", "<link>", "<href>", "<url>"], answer: 0 },
            { question: "Which tag is used for a dropdown?", options: ["<select>", "<option>", "<dropdown>", "<choice>"], answer: 0 },
            { question: "Which tag is used for bold text?", options: ["<b>", "<strong>", "<bold>", "Both <b> and <strong>"], answer: 3 },
            { question: "Which tag is used for italic text?", options: ["<i>", "<italic>", "<em>", "Both <i> and <em>"], answer: 3 },
            { question: "Which attribute is used for link destination?", options: ["href", "src", "link", "url"], answer: 0 },
            { question: "Which tag is used for a horizontal rule?", options: ["<hr>", "<line>", "<rule>", "<horizontal>"], answer: 0 },
            { question: "Which tag is used for a form?", options: ["<form>", "<input>", "<submit>", "<field>"], answer: 0 },
            { question: "Which tag is used for a table?", options: ["<table>", "<tbl>", "<grid>", "<data>"], answer: 0 }
        ],
        medium: [
            { question: "Which tag is used to add a link?", options: ["<a>", "<link>", "<href>", "<url>"], answer: 0 },
            { question: "Which attribute is used for an image source?", options: ["src", "href", "link", "alt"], answer: 0 },
            { question: "What is the correct DOCTYPE for HTML5?", options: ["<!DOCTYPE html>", "<!HTML5>", "<doctype>", "<html5>"], answer: 0 },
            { question: "Which is a self-closing tag?", options: ["<img>", "<p>", "<div>", "<h1>"], answer: 0 },
            { question: "Which tag is used for audio?", options: ["<audio>", "<sound>", "<music>", "<mp3>"], answer: 0 },
            { question: "Which tag is used for video?", options: ["<video>", "<movie>", "<media>", "<clip>"], answer: 0 },
            { question: "Which attribute is used for input type?", options: ["type", "kind", "mode", "format"], answer: 0 },
            { question: "Which tag is used for a table header?", options: ["<th>", "<thead>", "<header>", "<top>"], answer: 0 },
            { question: "Which tag is used for a canvas?", options: ["<canvas>", "<draw>", "<graphics>", "<paint>"], answer: 0 },
            { question: "Which attribute is used for the target window?", options: ["target", "window", "open", "destination"], answer: 0 },
            { question: "Which tag is used for scripts?", options: ["<script>", "<js>", "<javascript>", "<code>"], answer: 0 },
            { question: "Which tag is used for styles?", options: ["<style>", "<css>", "<styling>", "<format>"], answer: 0 },
            { question: "Which attribute is used for a CSS class?", options: ["class", "className", "style", "css"], answer: 0 },
            { question: "Which tag is used for an ordered list?", options: ["<ol>", "<ul>", "<list>", "<order>"], answer: 0 },
            { question: "Which tag is used for a list item?", options: ["<li>", "<item>", "<list>", "<element>"], answer: 0 },
            { question: "Which tag is used for a division?", options: ["<div>", "<section>", "<block>", "<container>"], answer: 0 },
            { question: "Which tag is used for a span?", options: ["<span>", "<inline>", "<text>", "<phrase>"], answer: 0 },
            { question: "Which attribute is used for a unique identifier?", options: ["id", "name", "identifier", "uid"], answer: 0 },
            { question: "Which tag is used for a textarea?", options: ["<textarea>", "<textbox>", "<multiline>", "<text>"], answer: 0 },
            { question: "Which tag is used for a button?", options: ["<button>", "<btn>", "<click>", "<submit>"], answer: 0 },
            { question: "Which attribute is used for image width?", options: ["width", "size", "w", "dimension"], answer: 0 },
            { question: "Which attribute is used for image height?", options: ["height", "h", "size", "dimension"], answer: 0 },
            { question: "Which tag is used for table data?", options: ["<td>", "<data>", "<cell>", "<column>"], answer: 0 },
            { question: "Which tag is used for the table body?", options: ["<tbody>", "<body>", "<content>", "<data>"], answer: 0 },
            { question: "Which tag is used for the table footer?", options: ["<tfoot>", "<footer>", "<bottom>", "<end>"], answer: 0 }
        ],
        hard: [
            { question: "Which is NOT a valid HTML5 element?", options: ["<section>", "<article>", "<nav>", "<container>"], answer: 3 },
            { question: "What is the default value of the position property?", options: ["static", "relative", "absolute", "fixed"], answer: 0 },
            { question: "Which tag is used for a semantic footer?", options: ["<footer>", "<bottom>", "<end>", "<div id='footer'>"], answer: 0 },
            { question: "Which HTML5 input type is used for email?", options: ["email", "mail", "e-mail", "address"], answer: 0 },
            { question: "What is the purpose of data-* attributes?", options: ["custom data storage", "database connection", "data validation", "data binding"], answer: 0 },
            { question: "Which tag is used for a semantic header?", options: ["<header>", "<head>", "<top>", "<banner>"], answer: 0 },
            { question: "What is the role of aria-label?", options: ["accessibility description", "label styling", "form validation", "data labeling"], answer: 0 },
            { question: "Which attribute is used for content security policy?", options: ["nonce", "security", "policy", "csp"], answer: 0 },
            { question: "What is the purpose of semantic HTML?", options: ["better accessibility and SEO", "faster loading", "smaller file size", "better styling"], answer: 0 },
            { question: "Which tag is used for a progress indicator?", options: ["<progress>", "<meter>", "<loading>", "<indicator>"], answer: 0 },
            { question: "What is the difference between <article> and <section>?", options: ["article is standalone content", "section is standalone content", "no difference", "depends on content"], answer: 0 },
            { question: "Which attribute is used for form validation?", options: ["required", "validate", "check", "verify"], answer: 0 },
            { question: "What is the purpose of the <time> element?", options: ["semantic time representation", "time formatting", "timezone conversion", "time calculation"], answer: 0 },
            { question: "Which attribute is used for input pattern?", options: ["pattern", "regex", "format", "validation"], answer: 0 },
            { question: "What is the role of the <main> element?", options: ["primary content area", "main navigation", "main header", "main footer"], answer: 0 },
            { question: "Which attribute is used for lazy loading?", options: ["loading", "lazy", "defer", "async"], answer: 0 },
            { question: "What is the purpose of the <details> element?", options: ["collapsible content", "detailed information", "metadata", "specifications"], answer: 0 },
            { question: "Which attribute is used for input autocomplete?", options: ["autocomplete", "autofill", "suggest", "complete"], answer: 0 },
            { question: "What is the role of the <aside> element?", options: ["sidebar content", "additional information", "related content", "all of the above"], answer: 3 },
            { question: "Which attribute is used for responsive images?", options: ["srcset", "responsive", "sizes", "both srcset and sizes"], answer: 3 },
            { question: "What is the purpose of the <picture> element?", options: ["responsive images", "image gallery", "picture frame", "image metadata"], answer: 0 },
            { question: "Which attribute is used for cross-origin requests?", options: ["crossorigin", "cors", "origin", "cross"], answer: 0 },
            { question: "What is the role of the <figure> element?", options: ["self-contained content", "mathematical figures", "chart data", "image container"], answer: 0 },
            { question: "Which attribute is used for input step?", options: ["step", "increment", "interval", "jump"], answer: 0 },
            { question: "What is the purpose of the <mark> element?", options: ["highlighted text", "marked content", "important text", "selected text"], answer: 0 },
            { question: "Which attribute is used for contenteditable elements?", options: ["contenteditable", "editable", "edit", "modify"], answer: 0 },
            { question: "What is the role of the <summary> element?", options: ["details summary", "content summary", "page summary", "article summary"], answer: 0 },
            { question: "Which attribute is used for drag and drop?", options: ["draggable", "drag", "drop", "move"], answer: 0 },
            { question: "What is the purpose of the <template> element?", options: ["reusable content template", "page template", "style template", "layout template"], answer: 0 },
            { question: "Which attribute is used for input multiple?", options: ["multiple", "multi", "many", "several"], answer: 0 },
            { question: "What is the role of the <output> element?", options: ["calculation result", "program output", "display output", "form output"], answer: 0 },
            { question: "Which attribute is used for hidden elements?", options: ["hidden", "hide", "invisible", "display"], answer: 0 },
            { question: "What is the purpose of the <datalist> element?", options: ["input suggestions", "data table", "data list", "database list"], answer: 0 },
            { question: "Which attributes are used for input min/max?", options: ["min and max", "range", "limit", "bounds"], answer: 0 },
            { question: "What is the role of the <wbr> element?", options: ["word break opportunity", "word boundary", "line break", "word wrap"], answer: 0 },
            { question: "Which attribute is used for spellcheck?", options: ["spellcheck", "spell", "check", "grammar"], answer: 0 },
            { question: "What is the purpose of the <kbd> element?", options: ["keyboard input", "key binding", "keyboard shortcut", "key display"], answer: 0 },
            { question: "Which attribute is used for translate?", options: ["translate", "translation", "lang", "locale"], answer: 0 },
            { question: "What is the role of the <samp> element?", options: ["sample output", "sample data", "sample code", "sample text"], answer: 0 },
            { question: "Which attribute is used for element direction?", options: ["dir", "direction", "orientation", "flow"], answer: 0 }
        ],
        impossible: [
            { question: "<span style='____: red;'>Text</span>", options: ["color", "background", "font", "display"], answer: 0 },
            { question: "<html><head><____>Title</____></head></html>", options: ["title", "meta", "link", "style"], answer: 0 },
            { question: "<img src='image.png' ____='description'>", options: ["alt", "title", "id", "name"], answer: 0 },
            { question: "<a ____='https://example.com'>Link</a>", options: ["href", "src", "link", "action"], answer: 0 },
            { question: "<table><tr><____>Data</____></tr></table>", options: ["td", "th", "tr", "caption"], answer: 0 },
            { question: "<form ____='/submit'>", options: ["action", "method", "href", "src"], answer: 0 },
            { question: "<input type='text' ____='username'>", options: ["name", "id", "class", "for"], answer: 0 },
            { question: "<label ____='username'>User:</label>", options: ["for", "id", "name", "class"], answer: 0 },
            { question: "<link rel='stylesheet' ____='style.css'>", options: ["href", "src", "link", "url"], answer: 0 },
            { question: "<script ____='app.js'></script>", options: ["src", "href", "link", "rel"], answer: 0 },
            { question: "<div ____='container'>Content</div>", options: ["class", "id", "name", "for"], answer: 0 },
            { question: "<p ____='paragraph'>Hello</p>", options: ["id", "class", "style", "name"], answer: 0 },
            { question: "<input type='____'>", options: ["text", "button", "submit", "checkbox"], answer: 0 },
            { question: "<ol><____>Item</____></ol>", options: ["li", "ul", "ol", "dd"], answer: 0 },
            { question: "<ul><____>Item</____></ul>", options: ["li", "ol", "ul", "dt"], answer: 0 },
            { question: "<head><____ charset='UTF-8'></head>", options: ["meta", "link", "style", "title"], answer: 0 },
            { question: "<body ____='background: blue;'>", options: ["style", "class", "id", "name"], answer: 0 },
            { question: "<h1 ____='main-title'>Heading</h1>", options: ["id", "class", "style", "name"], answer: 0 },
            { question: "<iframe ____='page.html'></iframe>", options: ["src", "href", "link", "action"], answer: 0 },
            { question: "<audio ____='song.mp3'></audio>", options: ["src", "href", "sound", "file"], answer: 0 },
            { question: "<video ____='movie.mp4'></video>", options: ["src", "href", "file", "data"], answer: 0 },
            { question: "<source ____='track.mp3'>", options: ["src", "href", "file", "path"], answer: 0 },
            { question: "<track ____='subtitles.vtt'>", options: ["src", "href", "file", "link"], answer: 0 },
            { question: "<button ____='submit'>Click</button>", options: ["type", "name", "id", "value"], answer: 0 },
            { question: "<form action='page.php' ____='post'>", options: ["method", "type", "send", "target"], answer: 0 },
            { question: "<input type='checkbox' ____>", options: ["checked", "selected", "disabled", "readonly"], answer: 0 },
            { question: "<input type='text' ____>", options: ["required", "checked", "hidden", "multiple"], answer: 0 },
            { question: "<input type='text' ____>", options: ["disabled", "readonly", "hidden", "multiple"], answer: 0 },
            { question: "<select><option ____>Choice</option></select>", options: ["selected", "checked", "active", "chosen"], answer: 0 },
            { question: "<img src='img.png' ____='100'>", options: ["width", "height", "size", "length"], answer: 0 },
            { question: "<img src='img.png' ____='200'>", options: ["height", "width", "size", "length"], answer: 0 },
            { question: "<table><____><tr><td>Cell</td></tr></____></table>", options: ["tbody", "thead", "tfoot", "caption"], answer: 0 },
            { question: "<table><____><td>Head</td></____></table>", options: ["tr", "thead", "tbody", "tfoot"], answer: 0 },
            { question: "<table><tr><____>Head</____></tr></table>", options: ["th", "td", "tr", "caption"], answer: 0 },
            { question: "<form><input type='text' ____='off'></form>", options: ["autocomplete", "autofocus", "readonly", "disabled"], answer: 0 },
            { question: "<input type='text' ____>", options: ["autofocus", "checked", "multiple", "hidden"], answer: 0 },
            { question: "<form><input type='file' ____></form>", options: ["multiple", "checked", "readonly", "disabled"], answer: 0 },
            { question: "<form ____>", options: ["novalidate", "autocomplete", "disabled", "readonly"], answer: 0 },
            { question: "<img src='img.png' ____='Image'>", options: ["alt", "title", "id", "name"], answer: 0 },
            { question: "<abbr ____='World Health Organization'>WHO</abbr>", options: ["title", "alt", "name", "id"], answer: 0 },
            { question: "<blockquote ____='author'>Quote</blockquote>", options: ["cite", "src", "href", "rel"], answer: 0 },
            { question: "<q ____='author'>Text</q>", options: ["cite", "src", "href", "rel"], answer: 0 },
            { question: "<ol ____='1'>", options: ["start", "value", "order", "index"], answer: 0 },
            { question: "<ol ____='A'>", options: ["type", "style", "class", "order"], answer: 0 },
            { question: "<li ____='3'>Item</li>", options: ["value", "index", "order", "num"], answer: 0 },
            { question: "<form><button ____='button'>Click</button></form>", options: ["type", "method", "action", "role"], answer: 0 },
            { question: "<form><input type='submit' ____='Save'></form>", options: ["value", "name", "id", "class"], answer: 0 },
            { question: "<progress ____='50' max='100'></progress>", options: ["value", "level", "data", "percent"], answer: 0 },
            { question: "<meter ____='0.5'></meter>", options: ["value", "min", "max", "data"], answer: 0 },
            { question: "<details><____>Info</____></details>", options: ["summary", "caption", "title", "header"], answer: 0 },
            { question: "<input type='number' min='1' ____='5'>", options: ["max", "step", "value", "size"], answer: 0 },
            { question: "<input type='number' min='1' max='10' ____='2'>", options: ["step", "size", "value", "interval"], answer: 0 },
            { question: "<textarea ____='4'></textarea>", options: ["rows", "cols", "size", "height"], answer: 0 },
            { question: "<textarea rows='4' ____='30'></textarea>", options: ["cols", "size", "width", "length"], answer: 0 },
            { question: "<iframe ____='0'></iframe>", options: ["frameborder", "border", "margin", "padding"], answer: 0 },
            { question: "<iframe ____='no'></iframe>", options: ["scrolling", "scroll", "overflow", "overflow-y"], answer: 0 },
            { question: "<div ____='tooltip'>Hover me</div>", options: ["title", "alt", "data", "name"], answer: 0 },
            { question: "<embed ____='file.swf'>", options: ["src", "href", "data", "link"], answer: 0 },
            { question: "<object ____='file.swf'></object>", options: ["data", "src", "href", "file"], answer: 0 },
            { question: "<canvas ____='myCanvas'></canvas>", options: ["id", "class", "name", "for"], answer: 0 },
            { question: "<svg ____='0 0 100 100'></svg>", options: ["viewBox", "width", "height", "xmlns"], answer: 0 }
        ]
},
    python: {
        easy: [
            { question: "What is the output of: print(2**3)?", options: ["6", "8", "9", "Error"], answer: 1 },
            { question: "Which keyword is used to print?", options: ["print", "echo", "output", "say"], answer: 0 },
            { question: "What is the symbol for a comment?", options: ["#", "//", "<!-- -->", "--"], answer: 0 },
            { question: "What is the data type of 'Hello'?", options: ["str", "string", "text", "char"], answer: 0 },
            { question: "What is the result of len('Python')?", options: ["5", "6", "7", "Error"], answer: 1 },
            { question: "Which operator is used for floor division?", options: ["//", "/", "%", "**"], answer: 0 },
            { question: "What is the result of 10 % 3?", options: ["1", "3", "0", "10"], answer: 0 },
            { question: "Which keyword is used for condition?", options: ["if", "when", "check", "condition"], answer: 0 },
            { question: "Which keyword is used for loop?", options: ["for", "loop", "repeat", "iterate"], answer: 0 },
            { question: "Which function is used for user input?", options: ["input", "read", "get", "scan"], answer: 0 },
            { question: "What is the result of type(5)?", options: ["<class 'int'>", "int", "integer", "number"], answer: 0 },
            { question: "Which symbol is used for string concatenation?", options: ["+", "&", ".", "concat"], answer: 0 },
            { question: "Which keyword is used for defining a function?", options: ["def", "function", "func", "define"], answer: 0 },
            { question: "What is the standard indentation in Python?", options: ["4 spaces", "2 spaces", "1 tab", "8 spaces"], answer: 0 },
            { question: "What is the result of bool(0)?", options: ["False", "True", "0", "Error"], answer: 0 }
        ],
        medium: [
            { question: "What is the data type of: {1,2,3}?", options: ["list", "set", "dict", "tuple"], answer: 1 },
            { question: "What is the result of: len('hello')?", options: ["4", "5", "6", "error"], answer: 1 },
            { question: "Which method is used to append to a list?", options: ["append", "add", "insert", "push"], answer: 0 },
            { question: "What is the result of [1,2,3][1]?", options: ["1", "2", "3", "Error"], answer: 1 },
            { question: "Which keyword is used for exception handling?", options: ["try", "catch", "handle", "error"], answer: 0 },
            { question: "What is the result of range(3)?", options: ["range(0, 3)", "[0,1,2]", "0,1,2", "3"], answer: 0 },
            { question: "Which method is used for string splitting?", options: ["split", "divide", "separate", "break"], answer: 0 },
            { question: "What is the result of 'abc'.upper()?", options: ["ABC", "abc", "Abc", "Error"], answer: 0 },
            { question: "Which function is used for absolute value?", options: ["abs", "absolute", "fabs", "magnitude"], answer: 0 },
            { question: "What is the result of list(range(1,4))?", options: ["[1,2,3]", "[1,2,3,4]", "[0,1,2,3]", "Error"], answer: 0 },
            { question: "Which keyword is used for class definition?", options: ["class", "object", "struct", "type"], answer: 0 },
            { question: "What is the result of max([1,3,2])?", options: ["3", "1", "2", "Error"], answer: 0 },
            { question: "Which method is used for dictionary keys?", options: ["keys", "getkeys", "keylist", "allkeys"], answer: 0 },
            { question: "What is the result of 'hello'[:3]?", options: ["hel", "hell", "ell", "lo"], answer: 0 },
            { question: "Which function is used for string to integer?", options: ["int", "integer", "toint", "parse"], answer: 0 },
            { question: "What is the result of [1,2] + [3,4]?", options: ["[1,2,3,4]", "[4,6]", "Error", "[1,2,[3,4]]"], answer: 0 },
            { question: "Which keyword is used for lambda function?", options: ["lambda", "anonymous", "func", "=>"], answer: 0 },
            { question: "What is the result of sorted([3,1,2])?", options: ["[1,2,3]", "[3,2,1]", "[3,1,2]", "Error"], answer: 0 },
            { question: "Which method is used to reverse a list?", options: ["reverse", "reversed", "backwards", "flip"], answer: 0 },
            { question: "What is the result of enumerate(['a','b'])?", options: ["enumerate object", "[(0,'a'),(1,'b')]", "[0,1]", "Error"], answer: 0 },
            { question: "Which function is used for zip operation?", options: ["zip", "combine", "merge", "pair"], answer: 0 },
            { question: "What is the result of any([False, True, False])?", options: ["True", "False", "Error", "None"], answer: 0 },
            { question: "Which method is used for string join?", options: ["join", "combine", "concat", "merge"], answer: 0 },
            { question: "What is the result of all([True, True, False])?", options: ["False", "True", "Error", "None"], answer: 0 },
            { question: "Which function is used for filter operation?", options: ["filter", "select", "choose", "pick"], answer: 0 }
        ],
        hard: [
            { question: "Which keyword is used to create a generator?", options: ["return", "yield", "generate", "func"], answer: 1 },
            { question: "What is the output of: list(range(0,10,3))?", options: ["[0,3,6,9]", "[0,3,6]", "[3,6,9]", "Error"], answer: 0 },
            { question: "What is the result of *args in a function?", options: ["variable arguments", "pointer", "multiplication", "Error"], answer: 0 },
            { question: "Which decorator is used for static methods?", options: ["@staticmethod", "@static", "@classmethod", "@method"], answer: 0 },
            { question: "What is the result of list comprehension [x**2 for x in range(3)]?", options: ["[0,1,4]", "[1,4,9]", "[0,1,2]", "Error"], answer: 0 },
            { question: "Which keyword is used for context manager?", options: ["with", "using", "context", "manager"], answer: 0 },
            { question: "What is the result of next(iter([1,2,3]))?", options: ["1", "2", "3", "Error"], answer: 0 },
            { question: "Which method is used for dictionary get with default?", options: ["get", "getdefault", "default", "fetch"], answer: 0 },
            { question: "What is the result of isinstance(5, int)?", options: ["True", "False", "int", "Error"], answer: 0 },
            { question: "Which keyword is used for multiple inheritance?", options: ["class Child(Parent1, Parent2)", "extends", "inherits", "implements"], answer: 0 },
            { question: "What is the result of hasattr(obj, 'attr')?", options: ["Boolean", "String", "Object", "Error"], answer: 0 },
            { question: "Which function is used to get object id?", options: ["id", "identity", "address", "ref"], answer: 0 },
            { question: "What is the result of callable(function)?", options: ["Boolean", "Function", "Object", "Error"], answer: 0 },
            { question: "Which method is used for string formatting?", options: ["format", "printf", "sprintf", "template"], answer: 0 },
            { question: "What is the result of vars() function?", options: ["local variables dict", "global variables", "all variables", "Error"], answer: 0 },
            { question: "Which keyword is used for assertion?", options: ["assert", "check", "verify", "test"], answer: 0 },
            { question: "What is the result of globals() function?", options: ["global namespace dict", "local namespace", "all globals", "Error"], answer: 0 },
            { question: "Which function is used for memory address?", options: ["id", "address", "memory", "location"], answer: 0 },
            { question: "What is the result of exec() function?", options: ["executes code", "returns result", "compiles code", "Error"], answer: 0 },
            { question: "Which function is used for code evaluation?", options: ["eval", "execute", "run", "calc"], answer: 0 },
            { question: "What is the result of compile() function?", options: ["code object", "bytecode", "executable", "Error"], answer: 0 },
            { question: "Which method is used for object serialization?", options: ["pickle", "serialize", "marshal", "json"], answer: 0 },
            { question: "What is the result of property decorator?", options: ["getter/setter", "class property", "instance property", "Error"], answer: 0 },
            { question: "Which keyword is used for metaclass?", options: ["metaclass", "meta", "class", "type"], answer: 0 },
            { question: "What is the result of __slots__ attribute?", options: ["memory optimization", "attribute control", "performance boost", "all of the above"], answer: 3 },
            { question: "Which function is used for dynamic import?", options: ["__import__", "import", "load", "require"], answer: 0 },
            { question: "What is the result of weakref module?", options: ["weak references", "reference counting", "garbage collection", "Error"], answer: 0 },
            { question: "Which keyword is used for coroutine?", options: ["async", "coroutine", "await", "concurrent"], answer: 0 },
            { question: "What is the result of await keyword?", options: ["pauses execution", "resumes execution", "creates task", "Error"], answer: 0 },
            { question: "Which function is used for task creation?", options: ["asyncio.create_task", "asyncio.task", "asyncio.run", "asyncio.start"], answer: 0 },
            { question: "What is the result of concurrent.futures module?", options: ["parallel execution", "sequential execution", "async execution", "Error"], answer: 0 },
            { question: "Which method is used for thread pool?", options: ["ThreadPoolExecutor", "ThreadPool", "Pool", "Executor"], answer: 0 },
            { question: "What is the result of multiprocessing module?", options: ["process-based parallelism", "thread-based parallelism", "async parallelism", "Error"], answer: 0 },
            { question: "Which function is used for process creation?", options: ["Process", "Thread", "Task", "Worker"], answer: 0 },
            { question: "What is the result of queue module?", options: ["thread-safe queues", "async queues", "priority queues", "all of the above"], answer: 3 },
            { question: "Which method is used for resource sharing?", options: ["Manager", "Share", "Sync", "Lock"], answer: 0 },
            { question: "What is the result of threading.Lock()?", options: ["mutual exclusion", "thread creation", "thread joining", "Error"], answer: 0 },
            { question: "Which keyword is used for GIL handling?", options: ["no specific keyword", "gil", "lock", "thread"], answer: 0 },
            { question: "What is the result of sys.getsizeof()?", options: ["object size in bytes", "object type", "object id", "Error"], answer: 0 },
            { question: "Which module is used for memory profiling?", options: ["tracemalloc", "memory", "profile", "debug"], answer: 0 }
        ],
        impossible: [
            { question: "for i in ___(5): print(i)", options: ["range", "list", "len", "map"], answer: 0 },
            { question: "___ x: x + 1", options: ["lambda", "def", "func", "map"], answer: 0 },
            { question: "with open('file.txt', 'r') as ___:", options: ["f", "file", "obj", "o"], answer: 0 },
            { question: "data = { 'a': 1 }; print(data.___('a'))", options: ["get", "pop", "keys", "values"], answer: 0 },
            { question: "nums = [1,2,3]; print(sum(nums) ___ len(nums))", options: ["/", "*", "+", "-"], answer: 0 },
            { question: "try:\n    x=1/0\nexcept ___:\n    print('error')", options: ["ZeroDivisionError", "ValueError", "TypeError", "Exception"], answer: 0 },
            { question: "import math\nprint(math.___(9))", options: ["sqrt", "pow", "exp", "log"], answer: 0 },
            { question: "nums = [1,2,3]; print(nums.___())", options: ["append", "pop", "clear", "sort"], answer: 1 },
            { question: "class A:\n    def ___(self):\n        return 'ok'", options: ["__init__", "__str__", "__repr__", "__call__"], answer: 0 },
            { question: "a = [1,2,3]; b = [*a, 4]; print(___)", options: ["b", "a", "len(a)", "sum(b)"], answer: 0 },
            { question: "nums = [3,1,2]; nums.___(); print(nums)", options: ["sort", "reverse", "append", "remove"], answer: 0 },
            { question: "print('Hello {0}'.___('format'))", options: ["replace", "format", "split", "join"], answer: 1 },
            { question: "for i, v in ___(['a','b']): print(i,v)", options: ["enumerate", "range", "zip", "map"], answer: 0 },
            { question: "from collections import ___", options: ["Counter", "List", "Stack", "Ordered"], answer: 0 },
            { question: "print(___([1,2,3], [4,5,6]))", options: ["zip", "map", "filter", "join"], answer: 0 },
            { question: "nums = [1,2,3]; print(max(nums) ___ min(nums))", options: ["-", "+", "*", "/"], answer: 0 },
            { question: "s = 'hello'; print(s.___('l'))", options: ["count", "find", "index", "split"], answer: 0 },
            { question: "d = {'x':1}; d.___('y',2); print(d)", options: ["update", "setdefault", "add", "insert"], answer: 1 },
            { question: "import random; print(random.___([1,2,3]))", options: ["choice", "shuffle", "randint", "sample"], answer: 0 },
            { question: "print(___(x for x in range(3)))", options: ["sum", "len", "list", "dict"], answer: 2 },
            { question: "nums = [1,2,3]; nums.___(4); print(nums)", options: ["append", "extend", "insert", "pop"], answer: 0 },
            { question: "nums = [1,2,3]; nums.___(0); print(nums)", options: ["pop", "remove", "clear", "sort"], answer: 0 },
            { question: "print('Python'.___())", options: ["lower", "upper", "title", "capitalize"], answer: 1 },
            { question: "x = [1,2]; y = x; print(x is ___)", options: ["y", "x.copy()", "list(x)", "None"], answer: 0 },
            { question: "a = {1,2}; b = {2,3}; print(a ___ b)", options: ["|", "&", "-", "^"], answer: 1 },
            { question: "nums = [1,2,3]; print(nums[___])", options: ["-1", "0", "1", "len(nums)"], answer: 0 },
            { question: "print(bool(___))", options: ["[]", "[0]", "['']", "[1]"], answer: 0 },
            { question: "nums = [1,2,3]; print(___(nums))", options: ["len", "sum", "max", "min"], answer: 0 },
            { question: "d = {'a':1}; print(list(d.___()))", options: ["keys", "values", "items", "get"], answer: 0 },
            { question: "print('a,b,c'.___(','))", options: ["split", "join", "replace", "strip"], answer: 0 },
            { question: "nums = [1,2,3]; print(nums[::___])", options: ["-1", "2", "1", "0"], answer: 0 },
            { question: "x = (1,2,3); print(type(x) is ___)", options: ["tuple", "list", "set", "dict"], answer: 0 },
            { question: "s = ' test '; print(s.___())", options: ["strip", "split", "rstrip", "lstrip"], answer: 0 },
            { question: "nums = [1,2,3]; print(___(nums))", options: ["sum", "map", "filter", "zip"], answer: 0 },
            { question: "print(chr(65) == ___)", options: ["'A'", "'a'", "'65'", "65"], answer: 0 },
            { question: "print(ord('A') == ___)", options: ["65", "97", "64", "66"], answer: 0 },
            { question: "nums = [1,2,3]; print(all(___ > 0 for x in nums))", options: ["x", "nums", "len(nums)", "sum(nums)"], answer: 0 },
            { question: "nums = [1,2,3]; print(any(___ == 2 for x in nums))", options: ["x", "nums", "len(nums)", "sum(nums)"], answer: 0 },
            { question: "print(___(range(5)))", options: ["list", "dict", "set", "tuple"], answer: 0 },
            { question: "print(isinstance(123, ___))", options: ["int", "str", "list", "float"], answer: 0 },
            { question: "nums = [1,2,3]; print(nums.___(0))", options: ["index", "count", "pop", "remove"], answer: 0 },
            { question: "s = 'banana'; print(s.___('a'))", options: ["find", "count", "index", "replace"], answer: 1 },
            { question: "nums = [1,2,3]; print(nums.___(2))", options: ["remove", "insert", "append", "extend"], answer: 1 },
            { question: "print(type(___))", options: ["None", "False", "''", "[]"], answer: 0 },
            { question: "print(2 ___ 3)", options: ["**", "*", "+", "-"], answer: 0 },
            { question: "x = {1,2,3}; print(2 in ___)", options: ["x", "list(x)", "tuple(x)", "dict()"], answer: 0 },
            { question: "nums = [1,2,3]; nums.___(); print(nums)", options: ["clear", "pop", "remove", "del"], answer: 0 },
            { question: "a = {1: 'x'}; print(a.___('y', 'z'))", options: ["get", "setdefault", "update", "pop"], answer: 1 },
            { question: "nums = [1,2,3]; print(___(nums))", options: ["tuple", "dict", "str", "int"], answer: 0 },
            { question: "from math import ___; print(factorial(5))", options: ["factorial", "sqrt", "pow", "log"], answer: 0 },
            { question: "x = 5; print(f'{x:___}')", options: ["03", "2f", "x", "0d"], answer: 0 },
            { question: "s = 'abc'; print(s.___('b','z'))", options: ["replace", "join", "strip", "split"], answer: 0 },
            { question: "nums = [1,2,3]; print(___(nums))", options: ["reversed", "sorted", "enumerate", "map"], answer: 1 },
            { question: "print(bin(5) == ___)", options: ["'0b101'", "'101'", "5", "'0b5'"], answer: 0 },
            { question: "print(hex(255) == ___)", options: ["'0xff'", "'ff'", "255", "'0x255'"], answer: 0 },
            { question: "print(oct(8) == ___)", options: ["'0o10'", "'8'", "'10'", "'0o8'"], answer: 0 },
            { question: "from itertools import ___", options: ["permutations", "list", "repeat", "sum"], answer: 0 },
            { question: "import sys; print(sys.___)", options: ["version", "path", "argv", "exit"], answer: 0 },
            { question: "print(divmod(7,3) == ___)", options: ["(2,1)", "(3,1)", "(2,0)", "(1,1)"], answer: 0 },
            { question: "print(round(3.14159, ___))", options: ["2", "1", "3", "0"], answer: 0 },
            { question: "from functools import ___; print(lru_cache)", options: ["lru_cache", "cache", "wraps", "partial"], answer: 0 },
            { question: "import json; print(json.___({'a':1}))", options: ["dumps", "dump", "loads", "load"], answer: 0 }

        ],
},
        css: {
            easy: [
                { question: "Which property is used to change text color?", options: ["color", "text-color", "font-color", "foreground"], answer: 0 },
                { question: "Which property is used to change background color?", options: ["background", "background-color", "bgcolor", "bg"], answer: 1 },
                { question: "Which property is used to change font size?", options: ["size", "text-size", "font-size", "font"], answer: 2 },
                { question: "Which property makes text bold?", options: ["font-weight", "text-bold", "weight", "bold"], answer: 0 },
                { question: "Which property makes text italic?", options: ["font-style", "text-italic", "italic", "style"], answer: 0 },
                { question: "Which property is used to underline text?", options: ["text-decoration", "decoration", "underline", "text-line"], answer: 0 },
                { question: "Which property controls text alignment?", options: ["align", "text-align", "position", "justify"], answer: 1 },
                { question: "Which property controls font family?", options: ["font-family", "text-font", "family", "typeface"], answer: 0 },
                { question: "Which property controls line spacing?", options: ["line-height", "spacing", "line-space", "height"], answer: 0 },
                { question: "Which property is used for margins?", options: ["margin", "space", "padding", "gap"], answer: 0 },
                { question: "Which property is used for padding?", options: ["padding", "space", "margin", "gap"], answer: 0 },
                { question: "Which property sets background images?", options: ["background-image", "image", "bg-image", "background"], answer: 0 },
                { question: "Which property makes text uppercase?", options: ["text-transform", "transform", "uppercase", "text-case"], answer: 0 },
                { question: "Which property sets text alignment left, right, or center?", options: ["text-align", "align", "position", "justify"], answer: 0 },
                { question: "Which property controls the cursor style?", options: ["cursor", "pointer", "mouse", "style"], answer: 0 }
            ],
            medium: [
                { question: "Which property controls element spacing inside the border?", options: ["margin", "padding", "gap", "spacing"], answer: 1 },
                { question: "Which property sets the width of an element?", options: ["size", "width", "element-width", "dimension"], answer: 1 },
                { question: "Which property sets the height of an element?", options: ["height", "length", "element-height", "dimension"], answer: 0 },
                { question: "Which property controls border thickness?", options: ["border-width", "border-size", "border", "outline"], answer: 0 },
                { question: "Which property controls border color?", options: ["border-color", "color-border", "border", "outline-color"], answer: 0 },
                { question: "Which property controls border style?", options: ["border-style", "style-border", "border-type", "outline-style"], answer: 0 },
                { question: "Which property makes corners rounded?", options: ["border-radius", "corner", "radius", "round"], answer: 0 },
                { question: "Which property controls element visibility?", options: ["display", "visibility", "show", "hidden"], answer: 1 },
                { question: "Which property hides an element but keeps space?", options: ["display:none", "opacity:0", "visibility:hidden", "hidden"], answer: 2 },
                { question: "Which property controls background repeat?", options: ["background-repeat", "repeat", "bg-repeat", "tile"], answer: 0 },
                { question: "Which property controls background position?", options: ["background-position", "position", "bg-pos", "background-align"], answer: 0 },
                { question: "Which property controls list style?", options: ["list-style", "list-type", "bullet", "marker"], answer: 0 },
                { question: "Which property changes link color?", options: ["color", "text-color", "link-color", "a-color"], answer: 0 },
                { question: "Which property controls table border collapse?", options: ["border-collapse", "collapse", "table-collapse", "border"], answer: 0 },
                { question: "Which property controls table cell spacing?", options: ["border-spacing", "cell-spacing", "spacing", "padding"], answer: 0 },
                { question: "Which property controls overflow content?", options: ["overflow", "scroll", "clip", "hide"], answer: 0 },
                { question: "Which property controls font weight?", options: ["font-weight", "weight", "boldness", "thickness"], answer: 0 },
                { question: "Which property sets minimum width?", options: ["min-width", "width-min", "minimum-width", "limit-width"], answer: 0 },
                { question: "Which property sets maximum width?", options: ["max-width", "width-max", "maximum-width", "limit-width"], answer: 0 },
                { question: "Which property controls word spacing?", options: ["word-spacing", "spacing", "letter-spacing", "gap"], answer: 0 },
                { question: "Which property controls letter spacing?", options: ["letter-spacing", "spacing", "word-spacing", "gap"], answer: 0 },
                { question: "Which property changes the mouse cursor on hover?", options: ["cursor", "pointer", "mouse", "hover"], answer: 0 },
                { question: "Which property sets element opacity?", options: ["opacity", "visibility", "alpha", "transparent"], answer: 0 },
                { question: "Which property controls the outline color?", options: ["outline-color", "border-color", "color", "highlight"], answer: 0 },
                { question: "Which property removes list bullets?", options: ["list-style:none", "no-bullet", "list:none", "bullet:none"], answer: 0 }
            ],
            hard: [
                { question: "Which unit is relative to the root font size?", options: ["em", "rem", "px", "%"], answer: 1 },
                { question: "Which property controls element stacking order?", options: ["position", "index", "z-index", "stack"], answer: 2 },
                { question: "Which property makes an element a flex container?", options: ["display:flex", "flex", "flexbox", "container"], answer: 0 },
                { question: "Which property controls flex item growth?", options: ["flex-grow", "grow", "expand", "flex"], answer: 0 },
                { question: "Which property controls grid columns?", options: ["grid-template-columns", "columns", "grid-columns", "col-template"], answer: 0 },
                { question: "Which property makes an element sticky?", options: ["position:sticky", "sticky", "display:sticky", "fixed"], answer: 0 },
                { question: "Which property controls element overflow?", options: ["overflow", "scroll", "clip", "hide"], answer: 0 },
                { question: "Which property adds shadow to a box?", options: ["box-shadow", "shadow", "element-shadow", "drop-shadow"], answer: 0 },
                { question: "Which property adds shadow to text?", options: ["text-shadow", "font-shadow", "shadow", "drop-shadow"], answer: 0 },
                { question: "Which property controls animations?", options: ["animation", "animate", "motion", "transition"], answer: 0 },
                { question: "Which property controls transition speed?", options: ["transition-duration", "duration", "speed", "time"], answer: 0 },
                { question: "Which property controls transition delay?", options: ["transition-delay", "delay", "time-delay", "animation-delay"], answer: 0 },
                { question: "Which property controls transition effect?", options: ["transition-timing-function", "ease", "timing", "transition-effect"], answer: 0 },
                { question: "Which property defines a grid area?", options: ["grid-area", "area", "grid", "region"], answer: 0 },
                { question: "Which property defines a grid row start?", options: ["grid-row-start", "row-start", "grid-start", "row"], answer: 0 },
                { question: "Which property defines a grid column start?", options: ["grid-column-start", "column-start", "col-start", "grid-start"], answer: 0 },
                { question: "Which property controls flex item alignment?", options: ["align-items", "justify-content", "flex-align", "align"], answer: 0 },
                { question: "Which property controls flex content distribution?", options: ["justify-content", "align-items", "flex-distribute", "content"], answer: 0 },
                { question: "Which property sets grid template rows?", options: ["grid-template-rows", "rows", "grid-rows", "row-template"], answer: 0 },
                { question: "Which property repeats grid patterns?", options: ["repeat()", "grid-repeat", "loop()", "pattern()"], answer: 0 },
                { question: "Which property sets a custom CSS variable?", options: ["--var", "var()", "variable", "define"], answer: 0 },
                { question: "Which function retrieves a custom property?", options: ["var()", "custom()", "prop()", "getVar()"], answer: 0 },
                { question: "Which property applies a transform?", options: ["transform", "change", "rotate", "scale"], answer: 0 },
                { question: "Which property rotates an element?", options: ["transform:rotate()", "rotate", "angle", "rotation"], answer: 0 },
                { question: "Which property scales an element?", options: ["transform:scale()", "scale", "resize", "zoom"], answer: 0 },
                { question: "Which property skews an element?", options: ["transform:skew()", "skew", "tilt", "angle"], answer: 0 },
                { question: "Which property translates an element?", options: ["transform:translate()", "move", "translate", "shift"], answer: 0 },
                { question: "Which property defines keyframes?", options: ["@keyframes", "@animation", "@frames", "@motion"], answer: 0 },
                { question: "Which property applies a filter?", options: ["filter", "effects", "visual", "style"], answer: 0 },
                { question: "Which function makes grayscale?", options: ["grayscale()", "gray()", "bw()", "monochrome()"], answer: 0 },
                { question: "Which function makes blur?", options: ["blur()", "fuzzy()", "shadow()", "opacity()"], answer: 0 },
                { question: "Which property controls clip path?", options: ["clip-path", "clip", "path", "mask"], answer: 0 },
                { question: "Which property controls masking?", options: ["mask", "masking", "clip", "cover"], answer: 0 },
                { question: "Which property controls writing mode?", options: ["writing-mode", "text-direction", "text-mode", "direction"], answer: 0 },
                { question: "Which property controls scroll snapping?", options: ["scroll-snap-type", "snap", "scroll", "snap-type"], answer: 0 },
                { question: "Which property controls object fit?", options: ["object-fit", "fit", "img-fit", "contain"], answer: 0 },
                { question: "Which property controls object position?", options: ["object-position", "position", "img-position", "align"], answer: 0 },
                { question: "Which property sets counter style?", options: ["counter-reset", "counter", "list-counter", "counter-style"], answer: 0 },
                { question: "Which property increments counter?", options: ["counter-increment", "counter-add", "counter-next", "counter"], answer: 0 }
            ],
            impossible: [
                { question: "h1 { color: ___; }", options: ["red", "font-size", "block", "inline"], answer: 0 },
                { question: "p { display: ___; }", options: ["block", "inline", "flex", "grid"], answer: 0 },
                { question: "div { position: ___; }", options: ["relative", "bold", "italic", "center"], answer: 0 },
                { question: "span { font-weight: ___; }", options: ["bold", "uppercase", "block", "inline"], answer: 0 },
                { question: "a:hover { text-decoration: ___; }", options: ["underline", "italic", "none", "capitalize"], answer: 0 },
                { question: "ul { list-style-type: ___; }", options: ["circle", "block", "inline", "italic"], answer: 0 },
                { question: "img { max-width: ___; }", options: ["100%", "cover", "flex", "grid"], answer: 0 },
                { question: "div { background-repeat: ___; }", options: ["no-repeat", "cover", "bold", "italic"], answer: 0 },
                { question: "p { text-transform: ___; }", options: ["uppercase", "block", "italic", "inline"], answer: 0 },
                { question: "body { overflow: ___; }", options: ["hidden", "cover", "bold", "fixed"], answer: 0 },
                { question: "section { margin-___: 10px; }", options: ["top", "block", "cover", "center"], answer: 0 },
                { question: "article { padding-___: 20px; }", options: ["left", "grid", "inline", "bold"], answer: 0 },
                { question: "h2 { font-style: ___; }", options: ["italic", "block", "center", "fixed"], answer: 0 },
                { question: "nav { display: ___; }", options: ["flex", "inline", "bold", "cover"], answer: 0 },
                { question: "main { background-size: ___; }", options: ["cover", "bold", "italic", "inline"], answer: 0 },
                { question: "footer { clear: ___; }", options: ["both", "inline", "bold", "grid"], answer: 0 },
                { question: "header { z-index: ___; }", options: ["10", "inline", "block", "cover"], answer: 0 },
                { question: "button { cursor: ___; }", options: ["pointer", "block", "inline", "italic"], answer: 0 },
                { question: "input { border-___: 1px solid #000; }", options: ["bottom", "cover", "inline", "bold"], answer: 0 },
                { question: "textarea { resize: ___; }", options: ["none", "block", "flex", "italic"], answer: 0 },
                { question: "div { box-shadow: 0 0 5px ___; }", options: ["black", "cover", "inline", "grid"], answer: 0 },
                { question: "p { line-height: ___; }", options: ["1.5", "block", "cover", "bold"], answer: 0 },
                { question: "img { object-fit: ___; }", options: ["cover", "italic", "grid", "inline"], answer: 0 },
                { question: "table { border-collapse: ___; }", options: ["collapse", "cover", "inline", "block"], answer: 0 },
                { question: "th { text-align: ___; }", options: ["left", "cover", "bold", "italic"], answer: 0 },
                { question: "td { vertical-align: ___; }", options: ["middle", "inline", "bold", "grid"], answer: 0 },
                { question: "a { target-name: ___; }", options: ["new", "block", "inline", "cover"], answer: 0 },
                { question: "div { border-radius: ___; }", options: ["50%", "cover", "inline", "italic"], answer: 0 },
                { question: "section { min-height: ___; }", options: ["100vh", "cover", "inline", "block"], answer: 0 },
                { question: "aside { float: ___; }", options: ["right", "cover", "grid", "inline"], answer: 0 },
                { question: "p { word-spacing: ___; }", options: ["5px", "cover", "block", "inline"], answer: 0 },
                { question: "span { letter-spacing: ___; }", options: ["2px", "cover", "grid", "italic"], answer: 0 },
                { question: "div { opacity: ___; }", options: ["0.5", "cover", "inline", "bold"], answer: 0 },
                { question: "h3 { visibility: ___; }", options: ["hidden", "cover", "block", "inline"], answer: 0 },
                { question: "nav { justify-content: ___; }", options: ["center", "cover", "grid", "italic"], answer: 0 },
                { question: "main { align-items: ___; }", options: ["flex-start", "block", "inline", "cover"], answer: 0 },
                { question: "body { background-attachment: ___; }", options: ["fixed", "cover", "grid", "inline"], answer: 0 },
                { question: "section { grid-template-columns: ___; }", options: ["1fr 1fr", "cover", "inline", "block"], answer: 0 },
                { question: "article { flex-direction: ___; }", options: ["row", "grid", "cover", "inline"], answer: 0 },
                { question: "header { position: ___; }", options: ["sticky", "cover", "inline", "block"], answer: 0 },
                { question: "div { background-clip: ___; }", options: ["padding-box", "cover", "grid", "inline"], answer: 0 },
                { question: "input { outline-___: none; }", options: ["style", "cover", "block", "italic"], answer: 0 },
                { question: "textarea { caret-color: ___; }", options: ["blue", "cover", "inline", "grid"], answer: 0 },
                { question: "p { white-space: ___; }", options: ["nowrap", "cover", "inline", "block"], answer: 0 },
                { question: "img { filter: ___; }", options: ["blur(5px)", "cover", "grid", "italic"], answer: 0 },
                { question: "button { user-select: ___; }", options: ["none", "cover", "inline", "block"], answer: 0 },
                { question: "div { overflow-___: scroll; }", options: ["y", "cover", "grid", "inline"], answer: 0 },
                { question: "span { text-shadow: 1px 1px ___; }", options: ["gray", "cover", "block", "italic"], answer: 0 },
                { question: "body { font-variant: ___; }", options: ["small-caps", "cover", "inline", "grid"], answer: 0 },
                { question: "h1 { animation-___: 2s fadeIn; }", options: ["duration", "cover", "block", "italic"], answer: 0 },
                { question: "div { transform: ___; }", options: ["rotate(45deg)", "cover", "inline", "bold"], answer: 0 },
                { question: "section { transition-___: all 0.3s; }", options: ["property", "cover", "block", "italic"], answer: 0 },
                { question: "p { clip-path: ___; }", options: ["circle(50%)", "cover", "inline", "grid"], answer: 0 },
                { question: "main { grid-gap: ___; }", options: ["20px", "cover", "block", "italic"], answer: 0 },
                { question: "article { align-content: ___; }", options: ["space-between", "cover", "grid", "inline"], answer: 0 },
                { question: "header { background-origin: ___; }", options: ["content-box", "cover", "inline", "block"], answer: 0 },
                { question: "div { writing-mode: ___; }", options: ["vertical-rl", "cover", "block", "italic"], answer: 0 },
                { question: "p { hyphens: ___; }", options: ["auto", "cover", "grid", "inline"], answer: 0 },
                { question: "nav { scroll-behavior: ___; }", options: ["smooth", "cover", "block", "italic"], answer: 0 },
                { question: "footer { column-count: ___; }", options: ["3", "cover", "inline", "grid"], answer: 0 }
            ],
},
            javascript: {
                easy: [
                    { question: "What keyword is used to declare a variable that can change value?", options: ["const", "let", "var", "static"], answer: 1 },
                    { question: "Which method prints output to the browser console?", options: ["print()", "console.log()", "log()", "alert()"], answer: 1 },
                    { question: "How do you write a single-line comment in JavaScript?", options: ["<!-- -->", "//", "/* */", "#"], answer: 1 },
                    { question: "What symbol is used for strict equality comparison?", options: ["==", "===", "!=", "="], answer: 1 },
                    { question: "Which array method adds an element to the end?", options: ["push()", "pop()", "shift()", "unshift()"], answer: 0 },
                    { question: "What keyword defines a function?", options: ["func", "function", "def", "method"], answer: 1 },
                    { question: "How do you access the first element of an array?", options: ["arr.1", "arr[1]", "arr[0]", "first(arr)"], answer: 2 },
                    { question: "Which object represents the browser window?", options: ["document", "window", "screen", "navigator"], answer: 1 },
                    { question: "How do you show a popup alert in JavaScript?", options: ["popup()", "alert()", "console.log()", "msg()"], answer: 1 },
                    { question: "What method converts a JSON object into a string?", options: ["JSON.stringify()", "JSON.parse()", "toString()", "stringifyJSON()"], answer: 0 },
                    { question: "Which keyword creates a block-scoped variable?", options: ["var", "let", "define", "static"], answer: 1 },
                    { question: "What does typeof [] return?", options: ["array", "object", "list", "collection"], answer: 1 },
                    { question: "Which operator is used to concatenate strings?", options: ["+", "&", ".", ","], answer: 0 },
                    { question: "How do you declare a constant in JavaScript?", options: ["let", "const", "static", "final"], answer: 1 },
                    { question: "What keyword stops a loop immediately?", options: ["stop", "exit", "break", "return"], answer: 2 }
                ],
                medium: [
                    { question: "Which array method removes the first element?", options: ["pop()", "shift()", "splice()", "slice()"], answer: 1 },
                    { question: "What does the map() method return?", options: ["modified array", "new array", "object", "number"], answer: 1 },
                    { question: "Which function executes code after a delay?", options: ["setInterval()", "delay()", "setTimeout()", "sleep()"], answer: 2 },
                    { question: "What is returned by Array.isArray({})?", options: ["true", "false", "undefined", "object"], answer: 1 },
                    { question: "Which method combines two arrays?", options: ["concat()", "merge()", "combine()", "join()"], answer: 0 },
                    { question: "What is the difference between == and ===?", options: ["No difference", "=== checks value only", "=== checks value and type", "== checks type only"], answer: 2 },
                    { question: "What keyword is used inside a class to call its parent?", options: ["super", "this", "parent", "extends"], answer: 0 },
                    { question: "Which method finds the index of an element in an array?", options: ["find()", "findIndex()", "indexOf()", "search()"], answer: 2 },
                    { question: "How do you define a default parameter in a function?", options: ["param=default", "param:default", "param==default", "default(param)"], answer: 0 },
                    { question: "What does Object.keys(obj) return?", options: ["array of values", "array of keys", "object", "string"], answer: 1 },
                    { question: "Which loop is best for iterating over object properties?", options: ["for", "forEach", "for...in", "for...of"], answer: 2 },
                    { question: "How do you create a promise that resolves immediately?", options: ["Promise.done()", "Promise.resolve()", "Promise.success()", "new Promise()"], answer: 1 },
                    { question: "What does JSON.parse(\"10\") return?", options: ["10", "string", "error", "undefined"], answer: 0 },
                    { question: "Which keyword is used with asynchronous functions?", options: ["async", "await", "defer", "yield"], answer: 0 },
                    { question: "What is the default value of an uninitialized variable?", options: ["null", "undefined", "0", "false"], answer: 1 },
                    { question: "How do you declare an arrow function?", options: ["=>", "->", "function=>", "() => {}"], answer: 3 },
                    { question: "What does arr.includes(x) return?", options: ["boolean", "index", "value", "error"], answer: 0 },
                    { question: "Which built-in object represents regular expressions?", options: ["Regex", "RegExp", "Pattern", "Expression"], answer: 1 },
                    { question: "How do you get the length of a string?", options: ["length()", "len()", "str.length", "size()"], answer: 2 },
                    { question: "What does null == undefined evaluate to?", options: ["true", "false", "error", "undefined"], answer: 0 },
                    { question: "Which array method removes and returns the last element?", options: ["pop()", "push()", "shift()", "splice()"], answer: 0 },
                    { question: "How do you stop event bubbling in JavaScript?", options: ["stop()", "prevent()", "stopPropagation()", "cancel()"], answer: 2 },
                    { question: "What is returned by typeof NaN?", options: ["NaN", "undefined", "object", "number"], answer: 3 },
                    { question: "What method joins all array elements into a string?", options: ["join()", "concat()", "merge()", "stringify()"], answer: 0 },
                    { question: "How do you convert a string to an integer in JavaScript?", options: ["parseInt()", "Number()", "toInteger()", "int()"], answer: 0 }
                ],
                hard: [
                    { question: "What is a closure in JavaScript?", options: ["A function with access to its scope", "An object reference", "A loop structure", "A class"], answer: 0 },
                    { question: "How does the this keyword behave in arrow functions?", options: ["Dynamic", "Static", "Global", "Changes"], answer: 1 },
                    { question: "What happens when you call a function with new?", options: ["Creates a class", "Creates an object", "Throws error", "Returns function"], answer: 1 },
                    { question: "What is the prototype chain in JavaScript?", options: ["Scope chain", "Object inheritance chain", "Call stack", "Event chain"], answer: 1 },
                    { question: "How does event delegation work?", options: ["By capturing child events at parent", "By removing listeners", "By preventing events", "By bubbling only"], answer: 0 },
                    { question: "What is the difference between call, apply, and bind?", options: ["They are identical", "Different ways to invoke functions", "Bind changes prototype", "Call changes closure"], answer: 1 },
                    { question: "How do you make an object immutable?", options: ["Object.freeze()", "Object.lock()", "Object.seal()", "Object.constant()"], answer: 0 },
                    { question: "What does the async keyword do?", options: ["Runs sync", "Returns a promise", "Blocks code", "Delays function"], answer: 1 },
                    { question: "How does await affect promises?", options: ["Rejects", "Resolves immediately", "Waits until resolved", "Skips"], answer: 2 },
                    { question: "What is the event loop in JavaScript?", options: ["Loop function", "Async mechanism", "Promise executor", "Timer"], answer: 1 },
                    { question: "How does hoisting work in JavaScript?", options: ["Moves vars and functions to top", "Deletes variables", "Blocks scope", "Ignores declarations"], answer: 0 },
                    { question: "What is the difference between undefined and not defined?", options: ["Same", "Undefined exists but not defined doesn’t", "Opposite", "Error"], answer: 1 },
                    { question: "How do generators (function*) work?", options: ["Return async code", "Return iterator", "Return array", "Return promise"], answer: 1 },
                    { question: "What is the purpose of Symbol in JavaScript?", options: ["Unique identifiers", "Classes", "Numbers", "Strings"], answer: 0 },
                    { question: "What is the difference between WeakMap and Map?", options: ["WeakMap allows garbage collection", "Map is immutable", "WeakMap stores numbers only", "Same"], answer: 0 },
                    { question: "What is the difference between Object.seal and Object.freeze?", options: ["Seal allows edits but not add/remove", "Freeze allows edits", "Both same", "Seal is stricter"], answer: 0 },
                    { question: "What is the purpose of Reflect in JavaScript?", options: ["Perform object operations", "Store metadata", "Handle async", "Debug"], answer: 0 },
                    { question: "How does a Proxy object work?", options: ["Intercepts operations", "Stores data", "Freezes object", "Copies object"], answer: 0 },
                    { question: "What is the difference between Promise.all and Promise.race?", options: ["All waits all, Race waits first", "Race waits all", "Same", "Race rejects only"], answer: 0 },
                    { question: "What is the difference between microtasks and macrotasks?", options: ["Micro run first", "Macro run first", "Same", "Only macros exist"], answer: 0 },
                    { question: "What is the difference between classical inheritance and prototypal inheritance?", options: ["Prototypal uses objects", "Classical uses prototypes", "Same", "Both async"], answer: 0 },
                    { question: "How does Object.create(null) differ from {}?", options: ["No prototype", "Adds prototype", "Same", "Throws error"], answer: 0 },
                    { question: "What is the difference between for...in and for...of?", options: ["in = keys, of = values", "in = values, of = keys", "Same", "Both arrays only"], answer: 0 },
                    { question: "What is an IIFE?", options: ["Function that runs immediately", "Loop", "Class", "Async block"], answer: 0 },
                    { question: "How does optional chaining (?.) work?", options: ["Checks null/undefined", "Checks type", "Checks number", "Checks string"], answer: 0 },
                    { question: "What is the difference between == and Object.is?", options: ["Object.is handles NaN correctly", "Same", "== handles NaN", "Object.is is looser"], answer: 0 },
                    { question: "How does destructuring assignment work with arrays?", options: ["Extracts values", "Clones array", "Removes values", "Changes array"], answer: 0 },
                    { question: "What is the difference between rest (...) and spread (...) operators?", options: ["Rest collects args, Spread expands", "Spread collects, Rest expands", "Same", "Both wrong"], answer: 0 },
                    { question: "How does dynamic import (import()) work?", options: ["Loads modules at runtime", "Static only", "Throws error", "Imports JSON only"], answer: 0 },
                    { question: "What is the purpose of BigInt?", options: ["Handle large integers", "Handle strings", "Handle floats", "Handle symbols"], answer: 0 },
                    { question: "How does TDZ affect variables?", options: ["Cannot access before declared", "Accessible always", "Throws warning", "Skips declaration"], answer: 0 },
                    { question: "What is the difference between NaN and Number.NaN?", options: ["Same", "NaN is global, Number.NaN is property", "Different values", "Number.NaN is undefined"], answer: 1 }
                ],

                impossible: [
                    { question: "class A { constructor(){ this.x=1 } } class B extends A { constructor(){ super(); this.y=2 } } console.log(new B().___)", options: ["x", "y", "z", "super"], answer: 0 },
                    { question: "let x = (function(){ return arguments })(); console.log(typeof x.___)", options: ["length", "callee", "caller", "prototype"], answer: 1 },
                    { question: "function* gen(){ yield 1; yield 2 } let g = gen(); console.log(g.___().value)", options: ["next", "yield", "return", "call"], answer: 0 },
                    { question: "let obj = {a:1}; let p = new Proxy(obj,{}); console.log(p.___)", options: ["a", "b", "c", "d"], answer: 0 },
                    { question: "console.log(Object.getPrototypeOf([]) === Array.___)", options: ["prototype", "constructor", "length", "name"], answer: 0 },
                    { question: "let s = Symbol(); console.log(typeof s.___)", options: ["description", "toString", "valueOf", "keyFor"], answer: 1 },
                    { question: "console.log(typeof (async function(){}).___)", options: ["constructor", "prototype", "then", "length"], answer: 2 },
                    { question: "let ws = new WeakSet(); let o={}; ws.add(o); console.log(ws.has(___))", options: ["o", "{}", "[]", "null"], answer: 0 },
                    { question: "let wm = new WeakMap(); let o={}; wm.set(o,123); console.log(wm.get(___))", options: ["o", "123", "{}", "null"], answer: 0 },
                    { question: "console.log(Reflect.___({a:1}, 'a'))", options: ["get", "set", "has", "deleteProperty"], answer: 0 },
                    { question: "console.log(Reflect.___({a:1}, 'a'))", options: ["has", "get", "set", "ownKeys"], answer: 0 },
                    { question: "console.log(Object.is(NaN, ___))", options: ["NaN", "undefined", "0", "null"], answer: 0 },
                    { question: "let f = new Function('a','b','return a+b'); console.log(f.___)", options: ["name", "length", "prototype", "caller"], answer: 1 },
                    { question: "console.log(eval.___)", options: ["name", "caller", "prototype", "length"], answer: 0 },
                    { question: "console.log((function(){}).___)", options: ["name", "length", "prototype", "toString"], answer: 0 },
                    { question: "console.log(typeof new Map().___)", options: ["size", "length", "count", "length()"], answer: 0 },
                    { question: "let set = new Set([1,2,3]); console.log(set.___)", options: ["size", "length", "count", "length()"], answer: 0 },
                    { question: "let arr=[1,2,3]; console.log(arr.___(x=>x>1))", options: ["find", "map", "reduce", "filter"], answer: 0 },
                    { question: "console.log(Object.getOwnPropertyDescriptor({a:1}, 'a').___)", options: ["value", "configurable", "writable", "enumerable"], answer: 0 },
                    { question: "console.log(Object.___({}, {a:{value:10}}).a)", options: ["create", "defineProperties", "assign", "defineProperty"], answer: 3 },
                    { question: "console.log(Object.getOwnPropertyNames(Math).includes('___'))", options: ["PI", "LN2", "E", "SQRT2"], answer: 0 },
                    { question: "console.log(Object.___([1,2,3]))", options: ["freeze", "seal", "preventExtensions", "assign"], answer: 0 },
                    { question: "console.log(JSON.___({a:1}))", options: ["stringify", "parse", "toString", "convert"], answer: 0 },
                    { question: "console.log(JSON.___('{\"a\":1}').a)", options: ["parse", "stringify", "eval", "fromJSON"], answer: 0 },
                    { question: "let x = new Int8Array(2); console.log(x.___)", options: ["length", "byteLength", "BYTES_PER_ELEMENT", "buffer"], answer: 2 },
                    { question: "console.log(typeof new Proxy({},{}).___)", options: ["constructor", "prototype", "toString", "valueOf"], answer: 0 },
                    { question: "console.log(typeof import('fs').___)", options: ["then", "catch", "finally", "all"], answer: 0 },
                    { question: "console.log(Array.prototype.___.call('abc'))", options: ["slice", "map", "filter", "concat"], answer: 0 },
                    { question: "console.log(Function.prototype.___.call(()=>42))", options: ["call", "apply", "bind", "toString"], answer: 3 },
                    { question: "let x = (function f(){ return f.___ }).toString(); console.log(x.includes('f'))", options: ["name", "caller", "prototype", "length"], answer: 0 },
                    { question: "console.log(Object.getOwnPropertySymbols(Symbol).includes(Symbol.___))", options: ["iterator", "asyncIterator", "toStringTag", "match"], answer: 2 },
                    { question: "console.log((async function(){}).constructor.___)", options: ["name", "length", "prototype", "caller"], answer: 0 },
                    { question: "console.log(typeof (function*(){}).___)", options: ["prototype", "constructor", "name", "caller"], answer: 0 },
                    { question: "console.log(Atomics.___)", options: ["add", "wait", "notify", "all"], answer: 0 },
                    { question: "let sab = new SharedArrayBuffer(8); console.log(sab.___)", options: ["byteLength", "length", "size", "capacity"], answer: 0 },
                    { question: "console.log(Reflect.ownKeys({a:1, [Symbol('b')]:2}).___)", options: ["length", "size", "count", "keys"], answer: 0 },
                    { question: "console.log(new Error('msg').___)", options: ["message", "stack", "name", "cause"], answer: 0 },
                    { question: "console.log(Math.___)", options: ["E", "PI", "LN2", "SQRT2"], answer: 1 },
                    { question: "console.log(globalThis.___)", options: ["Math", "Array", "Object", "undefined"], answer: 0 },
                    { question: "console.log(new Date().___)", options: ["getTime", "toISOString", "toString", "getFullYear"], answer: 3 },
                    { question: "console.log(typeof Intl.___)", options: ["DateTimeFormat", "NumberFormat", "Collator", "PluralRules"], answer: 0 },
                    { question: "console.log(typeof WebAssembly.___)", options: ["Module", "Instance", "Memory", "Table"], answer: 0 },
                    { question: "let x = 10n; console.log(typeof ___)", options: ["x", "BigInt", "Number", "String"], answer: 0 },
                    { question: "console.log(typeof Promise.___)", options: ["all", "race", "resolve", "reject"], answer: 0 },
                    { question: "console.log(Object.getPrototypeOf(async function(){}).constructor.___)", options: ["name", "prototype", "caller", "length"], answer: 0 },
                    { question: "console.log(Object.getOwnPropertyNames(Function.prototype).includes('___'))", options: ["bind", "apply", "call", "toString"], answer: 0 },
                    { question: "console.log(Object.getOwnPropertyNames(Array.prototype).includes('___'))", options: ["map", "filter", "push", "pop"], answer: 0 },
                    { question: "console.log(Object.getOwnPropertyNames(String.prototype).includes('___'))", options: ["charAt", "slice", "split", "toUpperCase"], answer: 0 },
                    { question: "console.log(Object.getOwnPropertyNames(Number.prototype).includes('___'))", options: ["toFixed", "toString", "valueOf", "toPrecision"], answer: 0 },
                    { question: "console.log(Object.getOwnPropertyNames(Boolean.prototype).includes('___'))", options: ["toString", "valueOf", "constructor", "prototype"], answer: 0 },
                    { question: "console.log(Object.getOwnPropertyNames(RegExp.prototype).includes('___'))", options: ["test", "exec", "compile", "toString"], answer: 0 },
                    { question: "console.log(Object.getOwnPropertyNames(Map.prototype).includes('___'))", options: ["set", "get", "has", "delete"], answer: 0 },
                    { question: "console.log(Object.getOwnPropertyNames(Set.prototype).includes('___'))", options: ["add", "has", "delete", "clear"], answer: 0 },
                    { question: "console.log(Object.getOwnPropertyNames(WeakMap.prototype).includes('___'))", options: ["set", "get", "has", "delete"], answer: 0 },
                    { question: "console.log(Object.getOwnPropertyNames(WeakSet.prototype).includes('___'))", options: ["add", "has", "delete", "clear"], answer: 0 },
                    { question: "console.log(Object.getOwnPropertyNames(Symbol).includes('___'))", options: ["for", "keyFor", "asyncIterator", "toString"], answer: 0 },
                    { question: "console.log(Object.getOwnPropertyNames(Reflect).includes('___'))", options: ["get", "set", "has", "deleteProperty"], answer: 0 },
                    { question: "console.log(Object.getOwnPropertyNames(Atomics).includes('___'))", options: ["add", "sub", "and", "or"], answer: 0 },
                    { question: "console.log(Object.getOwnPropertyNames(WebAssembly).includes('___'))", options: ["Module", "Instance", "Memory", "Table"], answer: 0 }
               
                ]
            }

};

// ===== Global Variables =====
let playerName = "";
let selectedLang = "";
let currentQuiz = [];
let currentIndex = 0;
let score = 0;
let timer;
let timeLeft = 20;
let shuffledOptions = [];

const questionLimits = { easy: 15, medium: 25, hard: 40, impossible: 60 };

// ===== Name Validation =====
async function isNameTaken(name) {
    const q = query(collection(db, "users"), where("name", "==", name));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
}

// ===== Start Game =====
window.startGame = async function () {
    const input = document.getElementById("playerName").value.trim();
    if (!input) {
        alert("Please enter your name!");
        return;
    }

    if (await isNameTaken(input)) {
        const proceed = confirm("This name already exists. Do you want to continue as this user?");
        if (!proceed) return; // user cancels → stop
        playerName = input;   // user agrees → log in
    } else {
        playerName = input;   // new user
    }

    document.getElementById("name-section").style.display = "none";
    document.getElementById("tabs").style.display = "block";

    await loadOverallLeaderboard();
};

// ===== Choose Language =====
window.chooseDifficulty = function (lang) {
    selectedLang = lang;
    document.getElementById("tabs").style.display = "none";
    document.getElementById("difficulty-section").style.display = "block";
};

// ===== Load Quiz =====
window.loadQuiz = function (difficulty) {
    if (!selectedLang) {
        alert("Please select a language first!");
        return;
    }

    let pool = [...(quizzes[selectedLang][difficulty] || [])];
    shuffleArray(pool);

    const limit = Math.min(questionLimits[difficulty], pool.length);
    currentQuiz = pool.slice(0, limit).map(q => ({ ...q, difficulty }));

    currentIndex = 0;
    score = 0;
    document.getElementById("difficulty-section").style.display = "none";

    loadLeaderboard(selectedLang, difficulty);
    showQuestion();
};

// ===== Show Question =====
function escapeHTML(str) {
    return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function showQuestion() {
    if (currentIndex < currentQuiz.length) {
        const q = currentQuiz[currentIndex];
        timeLeft = 20;

        shuffledOptions = q.options.map((opt, i) => ({ text: opt, index: i }));
        shuffleArray(shuffledOptions);

        document.getElementById("quiz-box").innerHTML = `
            <div class="question">${escapeHTML(q.question)}</div>
            <div class="timer">⏳ Time left: <span id="time">${timeLeft}</span>s</div>
            <div class="options">
                ${shuffledOptions.map((opt, i) =>
            `<button id="opt-${i}" class="option-btn" onclick="checkAnswer(${opt.index}, ${i})">${escapeHTML(opt.text)}</button>`
        ).join("")}
            </div>
        `;
        startTimer();
    } else {
        endGame();
    }
}

// ===== Timer =====
function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("time").textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            currentIndex++;
            showQuestion();
        }
    }, 1000);
}

// ===== Check Answer =====
window.checkAnswer = function (originalIndex, btnIndex) {
    clearInterval(timer);
    const q = currentQuiz[currentIndex];

    const optionButtons = document.querySelectorAll(".option-btn");
    optionButtons.forEach((btn, i) => {
        btn.disabled = true;
        if (shuffledOptions[i].index === q.answer) btn.classList.add("correct");
    });

    if (originalIndex !== q.answer) {
        document.getElementById(`opt-${btnIndex}`).classList.add("wrong");
    } else {
        score += 20 + timeLeft;
    }

    setTimeout(() => {
        currentIndex++;
        showQuestion();
    }, 1500);
};

// ===== End Game =====
async function endGame() {
    document.getElementById("quiz-box").innerHTML = `
        <div class="result">🎉 Tapos na! ${playerName}, score mo: ${score}</div>
        <button class="play-again-button" onclick="restart()">Play Again</button>
        <button class="go-home-button" onclick="goHome()">Go Home</button>
    `;
    await saveResult(playerName, score);
    loadLeaderboard(selectedLang, currentQuiz[0]?.difficulty || "easy");
}

// ===== Restart =====
window.restart = function () {
    document.getElementById("tabs").style.display = "block";
    document.getElementById("quiz-box").innerHTML = `<p class="initial-message">Pumili ng language.</p>`;
};

// ===== Go Home =====
window.goHome = function () {
    document.getElementById("name-section").style.display = "block";
    document.getElementById("tabs").style.display = "none";
    document.getElementById("difficulty-section").style.display = "none";
    document.getElementById("quiz-box").innerHTML = `<p class="initial-message">Pumili muna ng language.</p>`;
    document.getElementById("playerName").value = "";
};

// ===== Firebase Functions =====
async function saveResult(name, points) {
    try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("name", "==", name), where("lang", "==", selectedLang));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            const docRef = snapshot.docs[0].ref;
            const existingScore = snapshot.docs[0].data().score || 0;

            if (points > existingScore) {
                await updateDoc(docRef, { score: points, createdAt: new Date() });
                console.log("Updated user's high score!");
            } else {
                console.log("Score not higher than previous. Not updating.");
            }
        } else {
            await addDoc(usersRef, {
                name,
                score: points,
                lang: selectedLang,
                createdAt: new Date()
            });
            console.log("Saved new result!");
        }
    } catch (e) {
        console.error("Error saving result:", e);
    }
}

// ===== Overall Leaderboard =====
export async function loadOverallLeaderboard() {
    try {
        const usersRef = collection(db, "users");
        const querySnapshot = await getDocs(usersRef);
        const scores = {};

        querySnapshot.forEach(doc => {
            const data = doc.data();
            if (!scores[data.name]) scores[data.name] = 0;
            scores[data.name] += data.score || 0;
        });

        const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]).slice(0, 50);

        const list = document.getElementById("leaderboard-list");
        const label = document.getElementById("leaderboard-label");
        list.innerHTML = "";
        label.textContent = `🏆 Overall Top 50 Users`;

        sorted.forEach(([name, total], index) => {
            const li = document.createElement("li");
            li.textContent = `${index + 1}. ${name} - ${total}`;
            list.appendChild(li);
        });
    } catch (e) {
        console.error("Error loading overall leaderboard:", e);
    }
}

// ===== Filtered Leaderboard =====
export async function loadLeaderboard(lang, difficulty) {
    try {
        const q = query(collection(db, "users"), where("lang", "==", lang));
        const querySnapshot = await getDocs(q);

        const scores = {};

        querySnapshot.forEach(doc => {
            const data = doc.data();
            if (!scores[data.name] || data.score > scores[data.name]) {
                scores[data.name] = data.score;
            }
        });

        const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]).slice(0, 50);

        const list = document.getElementById("leaderboard-list");
        const label = document.getElementById("leaderboard-label");
        list.innerHTML = "";
        label.textContent = `Leaderboard: ${lang.toUpperCase()}`;

        sorted.forEach(([name, total], index) => {
            const li = document.createElement("li");
            li.textContent = `${index + 1}. ${name} - ${total}`;
            list.appendChild(li);
        });
    } catch (e) {
        console.error("Error loading filtered leaderboard:", e);
    }
}

// ===== Utility =====
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// ===== Auto-load overall leaderboard on page load =====
window.addEventListener('DOMContentLoaded', () => {
    loadOverallLeaderboard();
});
