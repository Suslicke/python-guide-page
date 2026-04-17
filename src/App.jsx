import { useState, useMemo, useEffect, useRef } from "react";
import { ChevronRight, ChevronDown, Check, Search, BookOpen, Code2, Cpu, Database, Layers, Lightbulb, Zap, Target, AlertTriangle, Box, GitBranch, Flame, Brain, Terminal, Shield, Package, Sparkles, RotateCcw, X, Command } from "lucide-react";

export default function PythonInterviewPrep() {
  const [openSections, setOpenSections] = useState({ 0: true });
  const [checked, setChecked] = useState({});
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [storageReady, setStorageReady] = useState(false);
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | error
  const searchRef = useRef(null);

  // Global keyboard shortcuts: "/" or "⌘K"/"Ctrl+K" focus the search, Esc clears it
  useEffect(() => {
    const onKey = (e) => {
      const target = e.target;
      const tag = target?.tagName;
      const isTyping =
        tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable;
      const isModK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      const isSlash = e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey;

      if (isModK) {
        e.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
      } else if (isSlash && !isTyping) {
        e.preventDefault();
        searchRef.current?.focus();
      } else if (
        e.key === "Escape" &&
        document.activeElement === searchRef.current
      ) {
        if (searchRef.current?.value) {
          setQuery("");
        } else {
          searchRef.current?.blur();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Load saved checkboxes on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("python-prep-checked");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          setChecked(parsed);
        }
      }
    } catch {
      // corrupted or unavailable, ignore
    } finally {
      setStorageReady(true);
    }
  }, []);

  // Persist checkboxes (debounced) whenever they change
  useEffect(() => {
    if (!storageReady) return;
    setSaveState("saving");
    const t = setTimeout(() => {
      try {
        localStorage.setItem("python-prep-checked", JSON.stringify(checked));
        setSaveState("saved");
        setTimeout(() => setSaveState("idle"), 1500);
      } catch {
        setSaveState("error");
      }
    }, 400);
    return () => clearTimeout(t);
  }, [checked, storageReady]);

  const clearAll = () => {
    if (!window.confirm("Clear all progress? This cannot be undone.")) return;
    setChecked({});
    try {
      localStorage.removeItem("python-prep-checked");
    } catch {
      // ignore — state is already cleared locally
    }
  };

  const toggle = (i) => setOpenSections((s) => ({ ...s, [i]: !s[i] }));
  const tick = (id) => setChecked((c) => ({ ...c, [id]: !c[id] }));

  const sections = [
    // ============ INTERVIEW MUST-HAVE ============
    {
      cat: "must",
      icon: <Flame size={18} />,
      title: "⭐ Interview Must-Have — The Short List",
      level: "For Monday",
      items: [
        {
          q: "How to use this section",
          a: `If you have **limited time**, focus here. These are the topics asked on almost every Python interview — Trainee through Senior. Everything below is a **quick reference / cheat sheet**. For deep dives, follow the pointers to the full sections.

**Interview day plan:**
1. Go through this list cold — if you stumble on anything, go to the full section and review
2. Then review tricky questions (Section 25) — easy points they love to test
3. Practice 2-3 coding problems out loud (Section 9)

**Format of each entry below:** a 2-sentence interview-ready answer. Click the full section for code and depth.`,
        },
        {
          q: "Q1 — Compiled vs Interpreted — where does Python fit?",
          a: `Python is **both**. Source \`.py\` → compiled to **bytecode** (\`.pyc\`) → executed by the **CPython Virtual Machine** (interpreter). So it's a bytecode-compiled, interpreted language — similar to Java's JVM model, not to C.

**Implementations:** CPython (reference, has GIL), PyPy (JIT, faster), Jython (JVM), IronPython (.NET), MicroPython (embedded).

→ See **Section 1** for the full breakdown.`,
        },
        {
          q: "Q2 — Mutable vs immutable + memory model",
          a: `**Immutable:** \`int, float, bool, str, tuple, frozenset, bytes\` — cannot change after creation. New value = new object.
**Mutable:** \`list, dict, set, bytearray\`, custom classes — can modify in place.

**Memory:** all objects live on the **heap**. Variables are **references** (name tags). Assignment never copies — \`b = a\` makes \`b\` point to the same object. CPython uses **reference counting + generational cyclic GC**. When refcount hits 0, the object is freed immediately; the cyclic collector cleans up reference cycles.

**Interning:** small ints (\`-5..256\`) and short strings are cached — that's why \`a = 256; b = 256; a is b\` is True but \`a = 257; b = 257; a is b\` is usually False. Use \`sys.intern()\` to force it. Never rely on \`is\` for value equality.

→ See **Section 1** ("Python memory model") and **Section 8** (Garbage Collection).`,
        },
        {
          q: "Q3 — LEGB rule (scope resolution)",
          a: `Python resolves names in this order, stopping at the first match:

1. **L**ocal — inside current function
2. **E**nclosing — enclosing function(s) (closures)
3. **G**lobal — module level
4. **B**uilt-in — \`print\`, \`len\`, \`Exception\`, etc.

Assignment inside a function creates a LOCAL binding by default. Use \`global\` to write to module level; \`nonlocal\` to write to enclosing function. Reading an outer variable works automatically — no keyword needed.

→ See **Section 1** ("Namespaces and the LEGB rule").`,
        },
        {
          q: "Q4 — None, False, 0, \"\", [] — what's the difference?",
          a: `All are **falsy** (evaluate to \`False\` in boolean context) but **not equal** and not interchangeable.

- \`None\` = "no value" (NoneType)
- \`False\` = boolean no (bool, subclass of int, so \`False == 0\`)
- \`0\` = numeric zero
- \`""\` = empty string
- \`[]\` = empty list

**Critical rule:** use \`is None\` for None checks, never \`== None\`. And \`if not x:\` is dangerous — it matches None AND 0 AND "" AND [], which often isn't what you want.

→ See **Section 1**.`,
        },
        {
          q: "Q5 — list vs tuple vs set vs dict",
          a: `- **list** \`[1,2,3]\` — ordered, mutable, O(n) \`in\`
- **tuple** \`(1,2,3)\` — ordered, immutable, hashable (if contents are), O(n) \`in\`
- **set** \`{1,2,3}\` — unordered, mutable, unique elements, **O(1) \`in\`**
- **frozenset** — immutable set, hashable
- **dict** \`{"k":"v"}\` — ordered (3.7+), mutable, **O(1) key lookup**

**Trap:** \`x in big_list\` is O(n); convert to \`set\` for repeated lookups.

→ See **Section 2**.`,
        },
        {
          q: "Q6 — Decorators",
          a: `A decorator is a **higher-order function that takes a function and returns a new function** — used to wrap/modify behavior without editing the original code. Built on closures + first-class functions.

\`\`\`python
from functools import wraps

def log(func):
    @wraps(func)                      # preserves __name__, __doc__
    def wrapper(*args, **kwargs):
        print(f"calling {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

@log
def greet(name): return f"hi {name}"
\`\`\`

**Always use \`@functools.wraps\`** to preserve the original's metadata. Common real-world ones: \`@property\`, \`@staticmethod\`, \`@lru_cache\`, \`@dataclass\`, \`@app.route\`.

→ See **Section 4** (15 decorator topics with real production examples).`,
        },
        {
          q: "Q7 — Generators and yield",
          a: `A generator is a function that uses \`yield\` — produces values lazily, one at a time, keeping O(1) memory.

\`\`\`python
def fib():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

from itertools import islice
list(islice(fib(), 10))    # [0,1,1,2,3,5,8,13,21,34]
\`\`\`

**Why it matters:** memory-constant for huge/infinite sequences. \`(x*x for x in range(10**9))\` works fine; the list-comp version would run out of RAM.

→ See **Section 5**.`,
        },
        {
          q: "Q8 — The GIL and threading/multiprocessing/asyncio",
          a: `The **Global Interpreter Lock** lets only ONE thread execute Python bytecode at a time — because CPython's reference counting isn't thread-safe. So threads **cannot** run CPU-bound Python code in parallel.

**Decision:**
- **I/O-bound** (HTTP, DB, file) → \`threading\` or \`asyncio\` (GIL released during I/O)
- **CPU-bound** (math, image, ML) → \`multiprocessing\` (separate processes, each with own GIL)
- **Massive I/O concurrency** (10k+ sockets) → \`asyncio\`

Real example: scraping 10k URLs → \`asyncio + aiohttp\`. Processing 50k images → \`multiprocessing.Pool\`.

→ See **Section 6** (+ async deep dive in Section 21).`,
        },
        {
          q: "Q9 — OOP — the four principles",
          a: `- **Encapsulation** — bundle data + methods, use \`_protected\` / \`__private\` naming, enforce invariants via \`@property\`
- **Inheritance** — reuse/extend via base classes; prefer composition when in doubt
- **Polymorphism** — duck typing + \`typing.Protocol\`; one interface, many implementations
- **Abstraction** — hide implementation behind \`ABC\` or \`Protocol\`; expose the WHAT not the HOW

**Python specifics:** no true private (only conventions); all methods virtual by default; multiple inheritance with C3 MRO; favor dataclasses for pure-data objects.

→ See **Section 3** (11 OOP topics).`,
        },
        {
          q: "Q10 — `__init__` vs `__new__`",
          a: `- **\`__new__(cls, ...)\`** — CREATES the instance, returns it. Static-method-like. Rarely overridden. Used for immutables (subclassing \`str\`, \`tuple\`), singletons, and classes that dispatch to subclasses.
- **\`__init__(self, ...)\`** — INITIALIZES the already-created instance. Returns None. 99% of your code.

\`__new__\` runs first; if it returns an instance of \`cls\`, Python then calls \`__init__\` on it.

→ See **Section 3**.`,
        },
        {
          q: "Q11 — `__str__` vs `__repr__`",
          a: `- **\`__str__\`** — for end users. Friendly, readable. Used by \`print()\`, \`str()\`, \`f"{x}"\`.
- **\`__repr__\`** — for developers. Unambiguous. Used by \`repr()\`, REPL, debuggers, tracebacks, list display.

If only \`__repr__\` is defined, it's used for both. **Always define \`__repr__\`**; the default (\`<Foo at 0x...>\`) is useless in logs.

→ See **Section 3**.`,
        },
        {
          q: "Q12 — `__eq__` and `__hash__` contract",
          a: `**Rule:** if \`a == b\`, then \`hash(a) == hash(b)\` must hold. Violating this breaks sets and dicts silently.

If you override \`__eq__\` only, Python **auto-sets \`__hash__ = None\`** → your class becomes unhashable. You must override both, or use \`@dataclass(frozen=True)\` which does both correctly.

Hashable ⇒ effectively immutable (the fields used in hash must not change).

→ See **Section 3**.`,
        },
        {
          q: "Q13 — Hash and how dicts/sets work",
          a: `A **hash** is a deterministic fixed-size int derived from an object. Dicts and sets are **hash tables** — they compute \`hash(key) → bucket index\`, giving **O(1) average** lookup.

**Only immutable (hashable) objects can be keys.** Strings, ints, tuples (of hashable elements) — yes. Lists, dicts — no. Since Python 3.3, string hashes are randomized per process (anti-DoS).

→ See **Section 7**.`,
        },
        {
          q: "Q14 — Exception handling + raise vs raise from",
          a: `\`\`\`python
try:
    risky()
except (ValueError, KeyError) as e:         # tuple of types
    log.warning("expected: %s", e)
except Exception:                            # never bare 'except:'
    log.exception("unexpected")
    raise
else:
    commit()                                 # only if no exception
finally:
    cleanup()                                # always runs
\`\`\`

**\`raise X from e\`** — translate error, keep chain.
**\`raise X from None\`** — hide implementation detail.
**bare \`raise\`** — re-raise current exception unchanged.

Custom exception hierarchy: \`AppError → NotFoundError / ValidationError / ConflictError\`.

→ See **Section 27** (Exceptions).`,
        },
        {
          q: "Q15 — Context managers (`with`)",
          a: `Ensures cleanup even on exception. Two ways to write:

\`\`\`python
# As a generator:
from contextlib import contextmanager
@contextmanager
def transaction(conn):
    try:
        yield conn
        conn.commit()
    except:
        conn.rollback()
        raise
    finally:
        conn.close()

# As a class:
class Timer:
    def __enter__(self): self.t = time.perf_counter(); return self
    def __exit__(self, exc_type, exc, tb):
        print(f"took {time.perf_counter() - self.t:.3f}s")
        return False          # don't swallow exception
\`\`\`

**\`__exit__\` returning True swallows the exception** — usually wrong.

→ See **Section 27**.`,
        },
        {
          q: "Q16 — Common coding problems (quick solutions)",
          a: `**Balanced parentheses** — stack, push openers, pop + match on closers, return \`not stack\` at end.

**Longest unique substring** — sliding window with \`dict[char]=last_idx\`; move \`start\` past duplicate when seen.

**Dict → query string** — \`urlencode(params, doseq=True, quote_via=quote_plus)\`. For huge: generator + \`"&".join\`; for massive: stream directly to socket/file.

**Two Sum** — \`dict[value]=index\`, check for \`target - n in seen\` as you iterate.

**Anagram** — \`Counter(a) == Counter(b)\`.

**Top K** — \`heapq.nlargest(k, items)\`.

→ See **Section 9** (15+ coding problems with full solutions).`,
        },
        {
          q: "Q17 — Tricky gotchas interviewers love",
          a: `**Mutable default args:**
\`\`\`python
def bad(x, items=[]):       # list created ONCE at def time
    items.append(x); return items
# Fix: items=None, then items = items or []
\`\`\`

**Late binding in closures:**
\`\`\`python
fns = [lambda: i for i in range(3)]
[f() for f in fns]            # [2,2,2] — not [0,1,2]!
# Fix: lambda i=i: i
\`\`\`

**\`[[0]*3]*3\`** creates 3 references to the SAME list. Use \`[[0]*3 for _ in range(3)]\`.

**\`x += [4]\` vs \`x = x + [4]\`** — first mutates in place, second rebinds.

**\`is\` vs \`==\`** — \`is\` checks identity. Use only for None/True/False/sentinels.

**\`sort()\` returns None** (in-place); \`sorted()\` returns a new list.

→ See **Section 25** (17+ tricky Q's).`,
        },
        {
          q: "Q18 — SOLID (in one breath)",
          a: `- **S**ingle Responsibility — one class, one reason to change
- **O**pen/Closed — add a class to extend; don't edit existing code
- **L**iskov — subclass must work wherever parent works
- **I**nterface Segregation — many small Protocols > one fat one
- **D**ependency Inversion — depend on abstractions (Protocols), inject concretions

**Python idiom:** use \`typing.Protocol\` for interfaces (structural/duck typing — no inheritance required). Inject dependencies in \`__init__\`. Swap implementations in main.py.

→ See **Section 10** (full examples per letter).`,
        },
        {
          q: "Q19 — What makes code \"Pythonic\"?",
          a: `- **List/dict/set comprehensions** instead of \`for\` + \`append\`
- **Generators** for large pipelines; \`itertools\` for chaining
- **Context managers** for any resource (files, locks, DB, sockets)
- **Dataclasses** or \`NamedTuple\` instead of dicts-as-records
- **f-strings** for formatting; \`str.join\` for concat
- **\`enumerate\`** instead of \`range(len(x))\`; **\`zip\`** for parallel iteration
- **Duck typing** + \`Protocol\`, not ABC heavy-hierarchies
- **EAFP** ("easier to ask forgiveness than permission") — try/except, not "check first"
- **Explicit is better than implicit** — type hints, \`from ... import name\` not \`*\`

→ See **Section 26** (Pythonic idioms).`,
        },
        {
          q: "Q20 — Interview day checklist",
          a: `**Before you code:**
- Ask about input size, edge cases, Unicode, empty inputs
- State your approach out loud BEFORE typing
- Write a simple brute force first, then optimize if asked

**After each solution:**
- State time + space complexity
- Mention edge cases you handled
- Suggest 1-2 further optimizations

**Python-specific strengths to drop naturally:**
- "I'd use a generator here for constant memory"
- "A set gives O(1) lookup here instead of O(n)"
- "\`@lru_cache\` memoizes this — avoids recomputation"
- "I'd release the GIL here with \`multiprocessing\`"
- "This needs a \`Lock\` — race condition between read and write"

**Be ready to discuss:** a real project, a hard bug you debugged, a time you picked threading/multiprocessing/async and why, trade-offs of a design choice.`,
        },
      ],
    },

    // ============ BASICS / FOUNDATIONS ============
    {
      cat: "basics",
      icon: <BookOpen size={18} />,
      title: "1. Foundations — How Python Works",
      level: "Trainee",
      items: [
        {
          q: "Compiled vs Interpreted — where does Python fit?",
          a: `**Compiled languages** (C, C++, Rust, Go) → source code is translated directly into machine code by a compiler BEFORE execution. Output = native binary. Fast, but platform-specific, slower dev cycle.

**Interpreted languages** (JavaScript, Ruby, Bash) → source code is read and executed line-by-line by an interpreter AT RUNTIME. Slower, but portable and flexible.

**Python is BOTH — hybrid.** Python source (.py) is first COMPILED to bytecode (.pyc files in __pycache__), then the CPython Virtual Machine (PVM) INTERPRETS the bytecode at runtime.

\`\`\`
.py  →  [Compiler]  →  .pyc (bytecode)  →  [PVM interpreter]  →  Output
\`\`\`

This is why Python is called "interpreted" colloquially but is technically a bytecode-compiled, interpreted language — similar to Java's JVM model.

**Key trade-offs:**
- Slower than C/Go because of interpreter overhead
- Faster dev cycle, no separate build step
- Portable bytecode (runs on any OS with a Python interpreter)
- Dynamic typing adds runtime cost but huge flexibility`,
        },
        {
          q: "CPython, PyPy, Jython, IronPython — what are they?",
          a: `These are DIFFERENT IMPLEMENTATIONS of the Python language spec:

- **CPython** — the reference implementation, written in C. This is what you get at python.org. Has the GIL.
- **PyPy** — written in Python itself (RPython). Uses a JIT compiler → often 4-10x faster than CPython for long-running code.
- **Jython** — runs on the Java Virtual Machine. Interops with Java libraries.
- **IronPython** — runs on the .NET CLR. Interops with C#.
- **MicroPython** — stripped-down Python for microcontrollers.

When an interviewer asks "why is Python slow?" the real answer is "CPython is slow due to interpreter overhead and the GIL — PyPy solves a lot of this."`,
        },
        {
          q: "Mutable vs Immutable types",
          a: `**Immutable** (cannot change after creation): \`int\`, \`float\`, \`bool\`, \`str\`, \`tuple\`, \`frozenset\`, \`bytes\`
**Mutable** (can change in place): \`list\`, \`dict\`, \`set\`, \`bytearray\`, custom classes

\`\`\`python
# Immutable — new object created
x = "hello"
y = x
x += " world"
print(y)  # "hello" — unchanged

# Mutable — same object modified
a = [1, 2, 3]
b = a
a.append(4)
print(b)  # [1, 2, 3, 4] — both point to same list!
\`\`\`

**Gotcha: default mutable arguments**
\`\`\`python
def bad(x, items=[]):       # BUG — list created ONCE at def time
    items.append(x)
    return items

def good(x, items=None):    # FIX — create fresh each call
    if items is None:
        items = []
    items.append(x)
    return items
\`\`\``,
        },
        {
          q: "== vs is",
          a: `- \`==\` compares VALUES (calls \`__eq__\`)
- \`is\` compares IDENTITY (same object in memory — same \`id()\`)

\`\`\`python
a = [1, 2, 3]
b = [1, 2, 3]
a == b      # True  — same contents
a is b      # False — different objects

a = 256
b = 256
a is b      # True  — small ints cached (-5 to 256)

a = 1000
b = 1000
a is b      # False (usually) — not cached
\`\`\`

Rule of thumb: use \`is\` ONLY for \`None\`, \`True\`, \`False\` comparisons.`,
        },
        {
          q: "Python memory model — stack vs heap, references",
          a: `Python variables are **references** (name tags) pointing to objects on the heap. The stack holds function frames and references; all objects live on the heap.

\`\`\`python
x = [1, 2, 3]    # 'x' on stack points to list on heap
y = x            # 'y' points to SAME heap object
\`\`\`

Assignment never copies — it binds a name to an object. To copy, use \`copy.copy()\` (shallow) or \`copy.deepcopy()\` (recursive).`,
        },
        {
          q: "None vs False vs 0 vs \"\" vs [] — what's the difference?",
          a: `All five are **falsy** (evaluate to False in boolean context). They are NOT equal, interchangeable, or the same thing.

\`\`\`python
# All falsy
bool(None), bool(False), bool(0), bool(""), bool([])   # (False, False, False, False, False)
bool(0.0), bool({}), bool(set()), bool(())             # also falsy

# But NOT equal to each other (mostly)
None == False        # False
None == 0            # False
None == ""           # False
False == 0           # True   ← bool is subclass of int!
0 == 0.0             # True   ← numeric equality
"" == []             # False
[] == {}             # False
[] == ()             # False  ← different types

# Identity (is) — even more strict
None is None         # True
False is False       # True   (singletons)
0 is 0               # True   (small int cache)
"" is ""             # True   (interned)
[] is []             # False  ← two different list objects!
\`\`\`

**What each one MEANS — use the right one for the right thing:**

| Value | Type | Meaning |
|---|---|---|
| \`None\` | NoneType | "no value", "not set", missing, default | 
| \`False\` | bool | explicit boolean "no" |
| \`0\` | int | numeric zero |
| \`""\` | str | empty string (different from None) |
| \`[]\` | list | empty collection (different from no collection) |

**Interview-critical rule:** use \`is None\`, not \`== None\`:
\`\`\`python
if x is None: ...        # ✅ identity check, always correct
if x == None: ...        # ❌ triggers __eq__, slower, sometimes wrong
if not x: ...            # ❌ matches None AND 0 AND "" AND [] — often a bug
\`\`\`

**Common bug:** \`if not users:\` matches both "query returned empty list" and "query failed and returned None". Use \`if users is None\` or \`if len(users) == 0\` based on what you actually mean.`,
        },
        {
          q: "pass, continue, break — control flow keywords",
          a: `Three keywords that look similar but do very different things.

\`\`\`python
# --- pass: do nothing. Placeholder syntax. ---
def todo():
    pass                       # function body required, fill later

class EmptyError(Exception):
    pass                       # valid class with no body

if some_condition:
    pass                       # "I'll handle this case later"
else:
    do_stuff()

# Use when syntax requires a block but you have nothing to put in it.

# --- continue: skip to next iteration of the loop ---
for n in range(10):
    if n % 2 == 0:
        continue               # skip even numbers
    print(n)                   # prints 1, 3, 5, 7, 9

# Useful for "guard clauses" — handle the early-exit case, continue loop
for user in users:
    if user.inactive:
        continue               # skip inactive users
    process(user)

# --- break: exit the loop entirely ---
for item in huge_list:
    if item == target:
        print("found it")
        break                  # stop searching
else:
    print("not found")         # ← runs ONLY if loop completed without break

# --- Combined ---
for row in data:
    if row.corrupted:
        continue               # skip this row
    if row.terminator:
        break                  # stop processing
    process(row)
\`\`\`

**pass** = "do nothing, I'm filling space"
**continue** = "skip rest of this iteration, next loop"
**break** = "exit the loop now"

Trap: \`for/else\` is rarely used but interviewers love to ask. The \`else\` runs when the loop exits NORMALLY (without \`break\`).`,
        },
        {
          q: "Arithmetic operators — //, /, %, **",
          a: `\`\`\`python
# --- / : true division, always returns float ---
7 / 2        # 3.5
6 / 2        # 3.0   ← float, not int
-7 / 2       # -3.5

# --- // : floor division, rounds toward NEGATIVE infinity ---
7 // 2       # 3
6 // 2       # 3
-7 // 2      # -4    ← NOT -3! Rounds DOWN, not toward zero
7.5 // 2     # 3.0   ← float in, float out

# --- % : modulo (remainder) ---
7 % 2        # 1
6 % 2        # 0
-7 % 2       # 1     ← Python's % has sign of DIVISOR, not dividend
7 % -2       # -1

# Identity: (a // b) * b + (a % b) == a  (always)
(-7 // 2) * 2 + (-7 % 2)   # -4 * 2 + 1 == -7 ✓

# --- ** : exponentiation ---
2 ** 10      # 1024
2 ** 0.5     # 1.4142... (square root)
2 ** -1      # 0.5
pow(2, 10)           # 1024  (same as 2 ** 10)
pow(2, 10, 1000)     # 24    — (2 ** 10) % 1000, done FAST (modular exponentiation)

# --- divmod: quotient + remainder in one call ---
divmod(7, 2)         # (3, 1)
hours, minutes = divmod(total_minutes, 60)
\`\`\`

**Interview trap:** \`-7 // 2\` is \`-4\`, not \`-3\`. Python floors (rounds toward −∞), whereas C/Java truncate (round toward 0). Same with \`%\`.`,
        },
        {
          q: "global vs nonlocal — which variable gets modified?",
          a: `Assignment in a function creates a LOCAL variable by default. \`global\` and \`nonlocal\` override that.

\`\`\`python
x = "module"                  # module-level

def outer():
    x = "outer"               # outer's local
    def inner():
        x = "inner"           # ← creates a NEW local, doesn't touch outer or module
        print(x)              # "inner"
    inner()
    print(x)                  # "outer" — unchanged

# --- global: reach up to MODULE level ---
counter = 0

def increment():
    global counter            # without this, 'counter += 1' is UnboundLocalError
    counter += 1              # modifies module-level counter

increment(); increment()
print(counter)                # 2

# --- nonlocal: reach up to nearest ENCLOSING function (not module) ---
def make_counter():
    count = 0                 # outer's local
    def inner():
        nonlocal count        # without this, 'count += 1' fails
        count += 1
        return count
    return inner

c = make_counter()
c(); c(); c()                 # 1, 2, 3

# --- What happens WITHOUT the declaration ---
def broken_counter():
    count = 0
    def inner():
        count += 1            # ❌ UnboundLocalError — tried to read local 'count' before assign
        return count
    return inner
\`\`\`

**Rule of thumb:**
- Reading an outer variable → works automatically (no keyword needed)
- **Assigning** to a module-level variable from inside a function → \`global\`
- **Assigning** to an enclosing function's variable → \`nonlocal\`
- Neither keyword is needed for mutation of mutable objects (\`lst.append(x)\` works without \`global\` because you're not reassigning \`lst\`)

**Real advice:** both \`global\` and \`nonlocal\` are code smells. Global state is hard to test; nested-function state usually wants to be a class. Use sparingly.`,
        },
        {
          q: "Namespaces and the LEGB rule",
          a: `A **namespace** is a mapping from names to objects (essentially a dict). Python has four, and lookups follow LEGB:

\`\`\`
L  Local      — inside the current function
E  Enclosing  — any enclosing function(s)  (closures)
G  Global     — the module's top level
B  Built-in   — names like print, len, Exception
\`\`\`

Python searches in this order and stops at the first match.

\`\`\`python
# Built-in
len                              # <built-in function len>

# Global
x = "module-level"               # lives in module namespace

def outer():
    y = "outer"                  # in outer's local namespace; enclosing for inner
    def inner():
        z = "inner"              # in inner's local namespace
        print(z, y, x, len)      # finds each via L, E, G, B respectively
    inner()

# Inspect namespaces
globals()                        # dict of module-level names
locals()                         # dict of local names (in current scope)
vars(some_obj)                   # namespace of an object (its __dict__)

# Shadowing
def oops():
    len = 5                      # ← now 'len' is local; built-in shadowed
    print(len([1,2,3]))          # TypeError — 'int' object is not callable
\`\`\`

**Key nuances:**
- Class bodies create their OWN namespace, but method bodies don't inherit from it (that's why you write \`self.x\`, not just \`x\`)
- \`import foo\` adds \`foo\` to the current namespace
- Each module has its own global namespace — "global" means "module-level", not "program-wide"
- The built-in namespace lives in \`builtins\` module and is shared across all modules`,
        },
      ],
    },

    // ============ DATA STRUCTURES / SLICING ============
    {
      cat: "basics",
      icon: <Layers size={18} />,
      title: "2. Lists, Slicing & Indexing",
      level: "Trainee → Mid",
      items: [
        {
          q: "Slicing cheat sheet — s[start:stop:step]",
          a: `The canonical syntax is \`sequence[start : stop : step]\`. All three are optional. \`stop\` is **exclusive**.

\`\`\`python
s = "abcdefgh"    # indices: 0 1 2 3 4 5 6 7
                  # neg:    -8 -7 -6 -5 -4 -3 -2 -1

s[0]        # 'a'
s[-1]       # 'h'         — last char
s[-2]       # 'g'         — second to last
s[:3]       # 'abc'       — first 3
s[3:]       # 'defgh'     — from index 3 to end
s[-2:]      # 'gh'        — LAST 2 symbols  ← your question
s[:-2]      # 'abcdef'    — all EXCEPT last 2
s[::2]      # 'aceg'      — every 2nd
s[::-1]     # 'hgfedcba'  — REVERSED
s[::-2]     # 'hfdb'      — reversed every 2nd
\`\`\`

**Answering your direct question:**
- \`s[:-2]\` → everything EXCEPT the last 2 chars (❌ not what you want)
- \`s[-2:]\` → the LAST 2 chars ✅

Mnemonic: \`:-2\` "chop off 2 from the end", \`-2:\` "give me the last 2".`,
        },
        {
          q: "List operations — time complexity",
          a: `Know these cold for interviews:

| Operation            | Complexity | Note |
|---------------------|-----------|------|
| \`lst[i]\` index      | O(1)      | array-backed |
| \`lst.append(x)\`     | O(1) amortized | |
| \`lst.pop()\`         | O(1)      | from end |
| \`lst.pop(0)\`        | O(n)      | shifts all elements |
| \`lst.insert(0, x)\`  | O(n)      | |
| \`x in lst\`          | O(n)      | linear scan |
| \`x in set/dict\`     | O(1) avg  | hash lookup |
| \`lst.sort()\`        | O(n log n)| Timsort |
| \`lst[a:b]\`          | O(b−a)    | creates new list |

If you need frequent front insertions, use \`collections.deque\` — O(1) on both ends.`,
        },
        {
          q: "List comprehension vs map/filter vs for loop",
          a: `\`\`\`python
# for loop
squares = []
for x in range(10):
    if x % 2 == 0:
        squares.append(x * x)

# list comprehension — Pythonic
squares = [x * x for x in range(10) if x % 2 == 0]

# map + filter — functional, returns iterator
squares = list(map(lambda x: x*x, filter(lambda x: x%2==0, range(10))))

# generator expression — lazy, memory-efficient
squares = (x * x for x in range(10) if x % 2 == 0)
\`\`\`

Rule: comprehensions for clarity, generators for big data, \`map/filter\` rarely needed.`,
        },
        {
          q: "Shallow vs deep copy",
          a: `\`\`\`python
import copy
a = [[1, 2], [3, 4]]

b = a              # reference — changes reflect
c = a.copy()       # shallow — outer new, inner shared
d = copy.deepcopy(a)  # fully independent

a[0].append(99)
print(b)  # [[1,2,99], [3,4]]  — shared
print(c)  # [[1,2,99], [3,4]]  — inner still shared!
print(d)  # [[1,2],    [3,4]]  — independent
\`\`\``,
        },
        {
          q: "Data structure tricks interviewers love",
          a: `**Swap without a temp variable**
\`\`\`python
a, b = b, a                        # tuple packing/unpacking
a, b, c = c, a, b                  # works for any number
\`\`\`

**Unpack with ***
\`\`\`python
first, *middle, last = [1, 2, 3, 4, 5]
# first=1, middle=[2,3,4], last=5

head, *tail = "abcdef"
# head='a', tail=['b','c','d','e','f']
\`\`\`

**Reverse a list / string**
\`\`\`python
lst[::-1]                          # new reversed list
list(reversed(lst))                # iterator → list
lst.reverse()                      # in-place, returns None!
"hello"[::-1]                      # 'olleh'
\`\`\`

**Remove duplicates (preserving order)**
\`\`\`python
list(dict.fromkeys(lst))           # Python 3.7+: dict preserves insertion order
# list(set(lst)) loses order!
\`\`\`

**Zip for parallel iteration / unzip**
\`\`\`python
for name, age in zip(names, ages): ...
pairs = list(zip(names, ages))             # [(name, age), ...]
names2, ages2 = zip(*pairs)                # unzip back
# zip(strict=True) (3.10+) raises if lengths differ
\`\`\`

**Enumerate with start index**
\`\`\`python
for i, line in enumerate(lines, start=1):
    print(f"{i}: {line}")
\`\`\`

**Dict comprehension with condition**
\`\`\`python
{k: v for k, v in d.items() if v is not None}
{v: k for k, v in d.items()}               # invert a dict
\`\`\`

**Group items by key**
\`\`\`python
from collections import defaultdict
groups = defaultdict(list)
for item in items:
    groups[item.category].append(item)
\`\`\`

**Count occurrences**
\`\`\`python
from collections import Counter
Counter("mississippi").most_common(3)      # [('i', 4), ('s', 4), ('p', 2)]
\`\`\`

**Chain multiple iterables**
\`\`\`python
from itertools import chain
for x in chain(list1, list2, list3): ...
\`\`\`

**Sort by multiple keys**
\`\`\`python
sorted(users, key=lambda u: (u.dept, -u.salary))      # dept asc, salary desc
\`\`\`

**Transpose a matrix**
\`\`\`python
matrix = [[1, 2, 3], [4, 5, 6]]
list(zip(*matrix))                  # [(1, 4), (2, 5), (3, 6)]
\`\`\`

**Find most common / check uniqueness**
\`\`\`python
max(set(lst), key=lst.count)        # most common element
len(set(lst)) == len(lst)           # are all elements unique?
\`\`\`

**Default dict values without KeyError**
\`\`\`python
d.get(key, default)                 # read with default
d.setdefault(key, []).append(x)     # get-or-create-then-append
\`\`\``,
        },
        {
          q: "list vs tuple — when to use each",
          a: `\`\`\`python
lst = [1, 2, 3]          # mutable
tpl = (1, 2, 3)          # immutable

lst.append(4)            # ✓ works
tpl.append(4)            # ✗ AttributeError — tuples have no 'append'

lst[0] = 99              # ✓ works
tpl[0] = 99              # ✗ TypeError — tuples don't support item assignment
\`\`\`

| | \`list\` | \`tuple\` |
|---|---|---|
| Mutability | mutable | immutable |
| Syntax | \`[1, 2, 3]\` | \`(1, 2, 3)\` or \`1, 2, 3\` |
| Hashable | ❌ no | ✓ yes (if elements are) |
| Dict key | ❌ | ✓ |
| Memory | more | less (~15% smaller) |
| Speed (creation, iter) | slower | faster |
| Typical use | homogeneous, growing | fixed record, heterogeneous |

**Rule of thumb:**
- **list** for a SEQUENCE of similar things, length changes over time: \`users: list[User]\`
- **tuple** for a RECORD with fixed structure, heterogeneous: \`(x, y, z)\` coordinates, \`(name, age, email)\`

\`\`\`python
# --- tuple as dict key ---
cache: dict[tuple[int, int], str] = {}
cache[(1, 2)] = "result"                # ✓
cache[[1, 2]] = "result"                # TypeError — list unhashable

# --- tuple is hashable only if ALL elements are ---
hash((1, 2, "a"))                       # OK
hash((1, [2, 3]))                       # TypeError — contains a list

# --- Named records: use NamedTuple or dataclass, not bare tuple ---
from typing import NamedTuple

class Point(NamedTuple):                # more readable than raw tuple
    x: float
    y: float

p = Point(1.0, 2.0)
p.x                                     # 1.0 — way clearer than p[0]
\`\`\`

**Gotcha — single-element tuple:**
\`\`\`python
(1)         # ← NOT a tuple! Just int 1 in parens
(1,)        # ← tuple of one element
\`\`\``,
        },
        {
          q: "set vs frozenset",
          a: `\`\`\`python
s  = {1, 2, 3}              # mutable set
fs = frozenset([1, 2, 3])   # immutable frozenset

s.add(4)                    # ✓ works
fs.add(4)                   # ✗ AttributeError
\`\`\`

| | \`set\` | \`frozenset\` |
|---|---|---|
| Mutable | ✓ | ❌ |
| Hashable | ❌ | ✓ |
| Can be dict key / set element | ❌ | ✓ |
| Literal syntax | \`{1, 2, 3}\` | none (use \`frozenset([1,2,3])\`) |

**When to use frozenset:**
\`\`\`python
# --- As dict keys ---
permissions: dict[frozenset[str], str] = {
    frozenset({"read"}):              "viewer",
    frozenset({"read", "write"}):     "editor",
    frozenset({"read", "write", "admin"}): "owner",
}
role = permissions[frozenset(user_perms)]

# --- As set elements (set of sets) ---
# s = {{1,2}, {3,4}}      # TypeError — can't have set inside set
s = {frozenset({1,2}), frozenset({3,4})}    # ✓

# --- Constants you don't want mutated ---
VALID_METHODS = frozenset({"GET", "POST", "PUT", "DELETE"})
# Can't accidentally .add() or .remove() from this module-level constant
\`\`\`

**Set operations (work on both):**
\`\`\`python
a, b = {1, 2, 3}, {2, 3, 4}
a | b          # {1,2,3,4}  union
a & b          # {2,3}      intersection
a - b          # {1}        difference
a ^ b          # {1,4}      symmetric difference
a <= b         # False      subset check
a.isdisjoint(b)  # False
\`\`\`

**Trap:** \`{}\` is an empty dict, NOT an empty set. Use \`set()\`.`,
        },
        {
          q: "Membership (`in`) — O(n) for list, O(1) for set/dict",
          a: `**The most common performance pitfall interviewers test for.**

\`\`\`python
big_list = list(range(10_000_000))
big_set  = set(range(10_000_000))

9_999_999 in big_list     # ~0.2 seconds — linear scan
9_999_999 in big_set      # ~0.0000001 seconds — hash lookup
\`\`\`

| Container | \`in\` complexity |
|---|---|
| \`list\`, \`tuple\` | O(n) |
| \`set\`, \`frozenset\` | O(1) average |
| \`dict\` (key lookup) | O(1) average |
| \`str\` (substring) | O(n·m) worst case |

**The classic optimization:**
\`\`\`python
# ❌ O(n × m) — for each user, scans ALL admins
def filter_admins_slow(users, admins: list):
    return [u for u in users if u in admins]

# ✅ O(n) — one set conversion, then O(1) lookups
def filter_admins_fast(users, admins: list):
    admin_set = set(admins)         # O(m) once
    return [u for u in users if u in admin_set]   # O(n)
\`\`\`

**When is the conversion worth it?**
- \`k\` lookups + \`list → set\` conversion: O(n + k)
- \`k\` lookups on list: O(n·k)
- Break-even around \`k ≈ log n\`, but in practice: **2+ lookups → set wins**

**Related idioms:**
\`\`\`python
# Deduplicate (preserving order in 3.7+)
list(dict.fromkeys(items))

# Fast "any of these?"
if user.role in {"admin", "owner", "editor"}: ...  # set literal, fast

# Set comprehension
bad_emails = {u.email for u in users if not u.verified}
\`\`\`

**Trap:** elements must be hashable. Lists/dicts in the list → can't convert to set; use a different approach.`,
        },
        {
          q: "Merging dicts — every way in one place",
          a: `\`\`\`python
d1 = {"a": 1, "b": 2}
d2 = {"b": 3, "c": 4}

# --- Python 3.9+: | operator (preferred, readable) ---
merged = d1 | d2                # {'a': 1, 'b': 3, 'c': 4}  — d2 wins on collision
d1 |= d2                        # in-place merge (mutates d1)

# --- Python 3.5+: ** unpacking ---
merged = {**d1, **d2}           # {'a': 1, 'b': 3, 'c': 4}
merged = {**d1, **d2, "d": 5}   # add/override in same expression

# --- Classic: dict.update() — in place ---
d1.update(d2)                   # mutates d1, returns None

# --- ChainMap: a VIEW, no copying ---
from collections import ChainMap
view = ChainMap(d2, d1)         # d2 takes priority — NO copy, stays in sync
view["a"]                       # 1 (falls through to d1)
view["b"]                       # 3 (from d2)
\`\`\`

**Which to use when:**

| Use case | Best |
|---|---|
| Create a new merged dict | \`d1 \\| d2\` (3.9+) or \`{**d1, **d2}\` |
| Mutate existing dict | \`d1.update(d2)\` |
| Logical merge without copying (layered config) | \`ChainMap\` |
| Deep merge (nested dicts) | Write it yourself — none of the above recurse |

**Deep merge** — stdlib doesn't provide one:
\`\`\`python
def deep_merge(a: dict, b: dict) -> dict:
    """Recursively merge b into a. b wins on conflict. Returns new dict."""
    result = dict(a)
    for k, v in b.items():
        if k in result and isinstance(result[k], dict) and isinstance(v, dict):
            result[k] = deep_merge(result[k], v)
        else:
            result[k] = v
    return result

deep_merge(
    {"api": {"host": "x", "port": 80}, "debug": False},
    {"api": {"port": 443}, "tls": True},
)
# {'api': {'host': 'x', 'port': 443}, 'debug': False, 'tls': True}
\`\`\`

**Merging with conflict resolution** (e.g., sum values):
\`\`\`python
from collections import Counter
Counter({"a": 1, "b": 2}) + Counter({"b": 3, "c": 4})
# Counter({'b': 5, 'c': 4, 'a': 1})
\`\`\``,
        },
      ],
    },

    // ============ OOP ============
    {
      cat: "oop",
      icon: <Box size={18} />,
      title: "3. OOP & Its Four Principles",
      level: "Mid → Senior",
      items: [
        {
          q: "The four pillars of OOP",
          a: `**1. Encapsulation** — bundle data + methods, enforce invariants, hide internals.
\`\`\`python
from decimal import Decimal
from threading import Lock

class Account:
    """Thread-safe bank account with invariant: balance >= 0."""

    def __init__(self, owner: str, balance: Decimal = Decimal("0")) -> None:
        if balance < 0:
            raise ValueError("initial balance must be non-negative")
        self._owner = owner
        self._balance = balance
        self._lock = Lock()           # protect against race conditions

    @property
    def balance(self) -> Decimal:
        return self._balance          # read-only from outside

    def deposit(self, amount: Decimal) -> None:
        if amount <= 0:
            raise ValueError("deposit must be positive")
        with self._lock:
            self._balance += amount

    def withdraw(self, amount: Decimal) -> None:
        if amount <= 0:
            raise ValueError("withdrawal must be positive")
        with self._lock:
            if amount > self._balance:
                raise ValueError("insufficient funds")
            self._balance -= amount
\`\`\`

Uses \`Decimal\` (never \`float\` for money), validates inputs, protects with a lock, exposes read-only balance via \`@property\`.

**2. Inheritance** — reuse/extend behavior, but prefer composition when possible.
\`\`\`python
from abc import ABC, abstractmethod

class Animal(ABC):
    def __init__(self, name: str) -> None:
        self.name = name
    @abstractmethod
    def speak(self) -> str: ...

class Dog(Animal):
    def speak(self) -> str:
        return f"{self.name} says Woof"
\`\`\`

**3. Polymorphism** — one interface, many forms. Python's duck typing + Protocols.
\`\`\`python
from typing import Protocol

class Notifier(Protocol):
    def send(self, msg: str) -> None: ...

class SlackNotifier:
    def send(self, msg: str) -> None: ...
class EmailNotifier:
    def send(self, msg: str) -> None: ...

def alert(notifier: Notifier, msg: str) -> None:
    notifier.send(msg)     # works with ANY object that has .send(msg)
\`\`\`

**4. Abstraction** — expose the WHAT, hide the HOW.
\`\`\`python
class Shape(ABC):
    @abstractmethod
    def area(self) -> float: ...

class Circle(Shape):
    def __init__(self, radius: float) -> None:
        if radius <= 0:
            raise ValueError("radius must be positive")
        self.radius = radius
    def area(self) -> float:
        from math import pi
        return pi * self.radius ** 2
\`\`\``,
        },
        {
          q: "Private / protected / public (name mangling)",
          a: `Python has no true access modifiers — only conventions:
- \`name\` → public
- \`_name\` → protected (convention: don't touch from outside)
- \`__name\` → name-mangled to \`_ClassName__name\` (harder to access)
- \`__name__\` → dunder/magic (leave alone)

\`\`\`python
class Foo:
    def __init__(self):
        self.a = 1       # public
        self._b = 2      # protected (by convention)
        self.__c = 3     # mangled

f = Foo()
f.a           # 1
f._b          # 2
f.__c         # AttributeError
f._Foo__c     # 3  ← mangled name works
\`\`\``,
        },
        {
          q: "@classmethod vs @staticmethod vs instance method",
          a: `\`\`\`python
from __future__ import annotations
from datetime import datetime, date
from dataclasses import dataclass
import json

@dataclass
class User:
    name: str
    email: str
    created_at: datetime

    # --- Instance method: operates on an instance ---
    def is_new(self, reference: datetime | None = None) -> bool:
        ref = reference or datetime.utcnow()
        return (ref - self.created_at).days < 30

    # --- Class method: alternative constructors (MOST common use) ---
    @classmethod
    def from_json(cls, raw: str) -> "User":
        data = json.loads(raw)
        return cls(
            name=data["name"],
            email=data["email"],
            created_at=datetime.fromisoformat(data["created_at"]),
        )

    @classmethod
    def from_db_row(cls, row: tuple) -> "User":
        name, email, created_at = row
        return cls(name=name, email=email, created_at=created_at)

    # --- Static method: utility function, namespaced on the class ---
    @staticmethod
    def is_valid_email(email: str) -> bool:
        return "@" in email and "." in email.split("@")[-1]

# Use
u = User.from_json('{"name":"Alice","email":"a@b.com","created_at":"2026-01-01T00:00:00"}')
User.is_valid_email("a@b.com")       # True — no instance needed
\`\`\`

- **Instance method** — needs an instance, operates on \`self\`
- **Class method** — receives the class, used for **alternative constructors** (\`from_json\`, \`from_db_row\`, \`from_dict\`) and factory methods. Works correctly with inheritance because \`cls\` is the actual subclass.
- **Static method** — pure utility, grouped on the class for namespacing`,
        },
        {
          q: "Method Resolution Order (MRO) & diamond inheritance",
          a: `Python uses **C3 linearization** to determine attribute lookup order in multiple inheritance.

\`\`\`python
class A:     pass
class B(A):  pass
class C(A):  pass
class D(B, C): pass

print(D.__mro__)
# (D, B, C, A, object)
\`\`\`

Always call \`super().__init__(*args, **kwargs)\` to respect MRO in cooperative multiple inheritance.`,
        },
        {
          q: "Dunder methods you should know",
          a: `A realistic example — a \`Money\` value object with proper comparison, arithmetic, and hashing.

\`\`\`python
from __future__ import annotations
from decimal import Decimal
from typing import Iterator

class Money:
    """Immutable money amount — safe to use as dict key, in sets, etc."""
    __slots__ = ("_amount", "_currency")

    def __init__(self, amount: Decimal | str | int, currency: str = "USD") -> None:
        object.__setattr__(self, "_amount", Decimal(str(amount)))
        object.__setattr__(self, "_currency", currency.upper())

    # --- Representation ---
    def __repr__(self) -> str:                # unambiguous, for devs/logs
        return f"Money({self._amount!r}, {self._currency!r})"
    def __str__(self) -> str:                 # readable, for users
        return f"{self._amount:.2f} {self._currency}"

    # --- Equality & hashing (must be consistent) ---
    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Money):
            return NotImplemented             # let the other side try
        return (self._amount, self._currency) == (other._amount, other._currency)
    def __hash__(self) -> int:
        return hash((self._amount, self._currency))

    # --- Ordering ---
    def __lt__(self, other: "Money") -> bool:
        self._check_currency(other)
        return self._amount < other._amount

    # --- Arithmetic ---
    def __add__(self, other: "Money") -> "Money":
        self._check_currency(other)
        return Money(self._amount + other._amount, self._currency)
    def __mul__(self, factor: int | Decimal) -> "Money":
        return Money(self._amount * Decimal(str(factor)), self._currency)

    # --- Truthiness & numeric coercion ---
    def __bool__(self) -> bool:
        return self._amount != 0

    def _check_currency(self, other: "Money") -> None:
        if self._currency != other._currency:
            raise ValueError(f"currency mismatch: {self._currency} vs {other._currency}")

# Usage
a = Money("9.99")
b = Money("1.00")
a + b                    # Money('10.99', 'USD')
a == Money("9.99")       # True
{a, Money("9.99")}       # set of 1 — hashable
a * 3                    # Money('29.97', 'USD')
\`\`\`

**Key dunders by category:**
- **Construction/repr:** \`__init__\`, \`__new__\`, \`__repr__\`, \`__str__\`, \`__format__\`
- **Comparison:** \`__eq__\`, \`__lt__\`, \`__le__\`, \`__gt__\`, \`__ge__\` (or \`@functools.total_ordering\`)
- **Hashing:** \`__hash__\` — MUST be consistent with \`__eq__\`
- **Arithmetic:** \`__add__\`, \`__sub__\`, \`__mul__\`, \`__truediv__\`, \`__floordiv__\`, \`__mod__\`, \`__pow__\`, \`__neg__\`, \`__abs__\`
- **Container:** \`__len__\`, \`__getitem__\`, \`__setitem__\`, \`__contains__\`, \`__iter__\`, \`__next__\`
- **Callable/context:** \`__call__\`, \`__enter__\`, \`__exit__\`
- **Attribute access:** \`__getattr__\`, \`__setattr__\`, \`__getattribute__\` (be careful)

**Return \`NotImplemented\`** (not \`False\`) when a comparison doesn't apply to the type — Python will then try the reflected operation on the other operand.`,
        },
        {
          q: "__init__ vs __new__ — object creation explained",
          a: `Two phases of object creation. You rarely override \`__new__\`, but knowing the difference is a senior-level question.

\`\`\`python
class Foo:
    def __new__(cls, *args, **kwargs):       # Step 1: CREATE the instance
        print(f"__new__ called, cls={cls}")
        instance = super().__new__(cls)       # actually allocate
        return instance                       # MUST return the instance!

    def __init__(self, x, y):                # Step 2: INITIALIZE it
        print(f"__init__ called, self={self}")
        self.x = x
        self.y = y

f = Foo(1, 2)
# __new__ called, cls=<class 'Foo'>
# __init__ called, self=<Foo object at 0x...>
\`\`\`

**Key differences:**

| | \`__new__\` | \`__init__\` |
|---|---|---|
| Receives | \`cls\` (the class) | \`self\` (the instance) |
| Returns | The new instance | Nothing (\`None\`) |
| When called | Before \`__init__\` | After \`__new__\` returns an instance of \`cls\` |
| Common use | Singletons, immutables, metaclasses | 99% of your OOP code |
| Type | Static method (implicit) | Instance method |

**When to actually override \`__new__\`:**

**1. Subclassing immutable types** (str, int, tuple — you CAN'T modify them in \`__init__\`):
\`\`\`python
class UpperStr(str):
    def __new__(cls, value: str) -> "UpperStr":
        return super().__new__(cls, value.upper())     # str is immutable, must set via __new__

u = UpperStr("hello")
u                # 'HELLO'
\`\`\`

**2. Singleton pattern:**
\`\`\`python
class Singleton:
    _instance = None
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

a, b = Singleton(), Singleton()
a is b           # True
\`\`\`

**3. Returning a DIFFERENT class from the constructor:**
\`\`\`python
class Shape:
    def __new__(cls, sides: int):
        if cls is Shape:
            if sides == 3: return object.__new__(Triangle)
            if sides == 4: return object.__new__(Square)
        return super().__new__(cls)
\`\`\`

**Gotcha:** if \`__new__\` returns an instance of \`cls\` (or a subclass), \`__init__\` is called. If it returns something else (another type entirely), \`__init__\` is SKIPPED.`,
        },
        {
          q: "__str__ vs __repr__ — when each is used",
          a: `Two ways to turn an object into a string, with different audiences.

\`\`\`python
from datetime import datetime

class User:
    def __init__(self, name: str, email: str, created: datetime) -> None:
        self.name = name
        self.email = email
        self.created = created

    def __repr__(self) -> str:
        # For DEVELOPERS. Should be unambiguous, ideally reproducible.
        # Goal: eval(repr(x)) == x (when practical)
        return f"User(name={self.name!r}, email={self.email!r}, created={self.created!r})"

    def __str__(self) -> str:
        # For END USERS. Should be readable, friendly.
        return f"{self.name} <{self.email}>"

u = User("Alice", "a@b.com", datetime(2026, 1, 1))

print(u)         # __str__  → "Alice <a@b.com>"
str(u)           #           → "Alice <a@b.com>"
repr(u)          # __repr__ → "User(name='Alice', email='a@b.com', created=datetime.datetime(2026, 1, 1, 0, 0))"
f"{u}"           # __str__
f"{u!r}"         # __repr__  ← the !r flag
[u]              # __repr__  ← collections use repr for their elements
\`\`\`

**Rules of thumb:**

| Audience | Method | Goal |
|---|---|---|
| Developer / logs / debugger | \`__repr__\` | Unambiguous. Show the type + all fields. |
| End user / UI / message | \`__str__\` | Readable. Friendly. |

**Fallback rule:** if only \`__repr__\` is defined, it's used for both \`str()\` AND \`repr()\`. If only \`__str__\` is defined, \`repr()\` falls back to the default \`<Object at 0x...>\`.

**Rule of thumb:** ALWAYS define \`__repr__\`. It's what shows up in tracebacks, logs, debuggers, and REPL — defaults are useless. Define \`__str__\` only when it would differ meaningfully.

**\`!r\` in f-strings** calls \`repr()\` — useful for logging strings so you can see quotes/escapes:
\`\`\`python
log.info("processing %r", filename)     # shows 'my file.txt' (quotes visible)
log.info("processing %s", filename)     # shows my file.txt (ambiguous)
\`\`\``,
        },
        {
          q: "__eq__ and __hash__ — the contract",
          a: `**The rule:** if \`a == b\` then \`hash(a) == hash(b)\` must also be true. Violating this breaks sets and dicts silently.

\`\`\`python
class Point:
    def __init__(self, x: int, y: int) -> None:
        self.x, self.y = x, y

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Point):
            return NotImplemented              # let Python try the other side
        return (self.x, self.y) == (other.x, other.y)

    def __hash__(self) -> int:
        return hash((self.x, self.y))          # use same fields as __eq__

p1 = Point(1, 2)
p2 = Point(1, 2)
p1 == p2                     # True
hash(p1) == hash(p2)         # True — contract respected
{p1, p2}                     # {Point(1,2)} — ONE element, deduplicated
{p1: "a", p2: "b"}           # {p1: "b"} — same key, overwritten
\`\`\`

**What happens if you override only \`__eq__\`?** Python AUTOMATICALLY sets \`__hash__ = None\` → your class becomes unhashable:

\`\`\`python
class Bad:
    def __init__(self, x): self.x = x
    def __eq__(self, o): return isinstance(o, Bad) and self.x == o.x
    # Oops — forgot __hash__

b = Bad(1)
{b}                          # TypeError: unhashable type: 'Bad'
d = {b: 1}                   # TypeError
\`\`\`

This is Python protecting you from dict/set corruption.

**Three valid configurations:**

**1. Hashable, equality-by-value** (tuples, frozen dataclasses) — override BOTH:
\`\`\`python
def __eq__(self, o): ...
def __hash__(self): return hash((self.x, self.y))
\`\`\`

**2. Equality-by-value but MUTABLE** → must be unhashable (like \`list\`):
\`\`\`python
def __eq__(self, o): ...
__hash__ = None              # explicitly unhashable
\`\`\`

**3. Identity-based (default Python behavior)** — don't override either. Two different instances are never equal; hash is based on \`id()\`.

**Common bug:** make a class \`__eq__\`-by-value AND mutable AND put it in a set. Then mutate it. Now the set is corrupt — \`x in s\` returns \`False\` even though \`x\` is in \`s\` — because its hash changed.

**Rule:** hashable ⇒ effectively immutable (at least for the fields used in \`__hash__\`).

**Easy button:** \`@dataclass(frozen=True)\` does all this correctly — generates \`__eq__\`, \`__hash__\`, and blocks mutation.`,
        },
        {
          q: "Descriptors — what Python's attribute access uses under the hood",
          a: `A **descriptor** is any object that defines one or more of \`__get__\`, \`__set__\`, \`__delete__\`. When put on a class, it intercepts attribute access on instances of that class.

**\`@property\`, \`@classmethod\`, \`@staticmethod\` are ALL descriptors.** That's how they work.

\`\`\`python
class Descriptor:
    """Basic descriptor — does nothing but show the protocol."""
    def __set_name__(self, owner, name):        # called when attached to a class
        self.name = name
    def __get__(self, instance, owner):         # called on read: instance.attr
        print(f"__get__ called for {self.name!r}")
        return instance.__dict__[self.name]
    def __set__(self, instance, value):         # called on write: instance.attr = ...
        print(f"__set__ called for {self.name!r}")
        instance.__dict__[self.name] = value
    def __delete__(self, instance):             # called on del: del instance.attr
        del instance.__dict__[self.name]

class MyClass:
    x = Descriptor()                            # attach at CLASS level

obj = MyClass()
obj.x = 10       # __set__ called for 'x'
obj.x            # __get__ called for 'x'  →  10
\`\`\`

**Practical example — a validated field:**
\`\`\`python
class PositiveInt:
    """Descriptor that enforces a positive integer."""
    def __set_name__(self, owner, name):
        self._name = f"_{name}"                 # underlying storage
    def __get__(self, instance, owner):
        if instance is None:
            return self                         # class-level access returns descriptor
        return getattr(instance, self._name)
    def __set__(self, instance, value):
        if not isinstance(value, int) or value < 0:
            raise ValueError(f"must be positive int, got {value!r}")
        setattr(instance, self._name, value)

class Product:
    price = PositiveInt()                       # validates on every assignment
    quantity = PositiveInt()

    def __init__(self, price: int, quantity: int) -> None:
        self.price = price
        self.quantity = quantity

p = Product(100, 5)
p.price = -5         # ValueError: must be positive int, got -5
p.price = "10"       # ValueError: must be positive int, got '10'
\`\`\`

**Why descriptors matter:**
- \`@property\` creates a data descriptor with \`__get__\`/\`__set__\`/\`__delete__\`
- \`@classmethod\` creates a descriptor that rebinds the first arg to the class
- \`@staticmethod\` creates a descriptor that unbinds the first arg
- SQLAlchemy/Django ORM fields — \`User.name\` is a descriptor that generates SQL
- \`functools.cached_property\` — descriptor that computes once, caches on instance

**Two kinds of descriptors:**
- **Data descriptor** (has \`__set__\` OR \`__delete__\`) → takes priority over instance \`__dict__\`
- **Non-data descriptor** (only \`__get__\`) → instance \`__dict__\` wins if the attribute exists there

This priority is exactly why \`obj.some_method\` finds the class's method rather than some \`obj.some_method = ...\` assignment making methods unusable.

**When to actually write one:** 99% of cases — just use \`@property\`. Reach for a full descriptor only when the SAME validation/behavior applies to MANY attributes (like an ORM field) — avoids copy-pasting property setters.`,
        },
        {
          q: "Metaclasses — classes that create classes",
          a: `In Python, everything is an object — including classes. The type of a class is its **metaclass**. By default, that metaclass is \`type\`.

\`\`\`python
class Foo: pass
type(Foo)             # <class 'type'>       — Foo's metaclass
type(Foo())           # <class '__main__.Foo'> — an instance's type IS Foo

# Classes can be created dynamically via type() — the 3-arg form:
Dog = type("Dog", (object,), {"speak": lambda self: "Woof"})
Dog().speak()         # "Woof"
# Same result as: class Dog: def speak(self): return "Woof"
\`\`\`

**Writing a metaclass — intercept class creation:**
\`\`\`python
class AutoRepr(type):
    """Metaclass that auto-generates __repr__ for any class using it."""
    def __new__(mcs, name, bases, namespace):
        cls = super().__new__(mcs, name, bases, namespace)
        if "__repr__" not in namespace:
            def __repr__(self):
                fields = ", ".join(f"{k}={v!r}" for k, v in self.__dict__.items())
                return f"{name}({fields})"
            cls.__repr__ = __repr__
        return cls

class User(metaclass=AutoRepr):
    def __init__(self, name, age):
        self.name, self.age = name, age

repr(User("Alice", 30))   # "User(name='Alice', age=30)"   ← generated
\`\`\`

**Real uses of metaclasses:**
- **ORMs** (SQLAlchemy pre-2.0, Django models) — classes declare fields, metaclass builds schema
- **ABCs** — \`abc.ABCMeta\` intercepts class creation to register abstract methods
- **Singletons via metaclass** (see Architecture section)
- **API surface enforcement** — check that every subclass implements required methods at DEFINITION time (not instantiation)

**Rule of thumb — from Tim Peters:**
> "Metaclasses are deeper magic than 99% of users should ever worry about. If you wonder whether you need them, you don't."

**Modern alternatives** that handle most metaclass use cases without the complexity:
- \`__init_subclass__\` — hook called when a subclass is defined (3.6+)
- \`__set_name__\` — hook called when a descriptor is attached to a class
- Class decorators — apply transformations without metaclass machinery

\`\`\`python
class Base:
    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        if not hasattr(cls, "required_method"):
            raise TypeError(f"{cls.__name__} must define required_method")

class Good(Base):
    def required_method(self): ...    # OK

class Bad(Base): ...                  # TypeError at class DEFINITION time
\`\`\``,
        },
        {
          q: "__call__ — making instances callable",
          a: `Define \`__call__\` and your instances can be invoked like functions.

\`\`\`python
class Multiplier:
    def __init__(self, factor: int) -> None:
        self.factor = factor

    def __call__(self, x: int) -> int:
        return x * self.factor

double = Multiplier(2)
triple = Multiplier(3)

double(5)               # 10  — uses __call__
triple(5)               # 15
list(map(double, [1, 2, 3]))    # [2, 4, 6]
\`\`\`

**Why this matters:**
- Lets you create **configurable functions** that hold state
- Bridges OOP and functional styles
- The foundation for class-based decorators (the \`__call__\` on the decorator is invoked when the decorated function runs)
- Commonly used for **strategy objects** that need setup + multiple calls

**Classic use — a stateful processor:**
\`\`\`python
class RateLimiter:
    def __init__(self, max_per_sec: int) -> None:
        self.max = max_per_sec
        self._tokens = max_per_sec
        self._last = time.monotonic()

    def __call__(self) -> bool:
        now = time.monotonic()
        self._tokens = min(self.max, self._tokens + (now - self._last) * self.max)
        self._last = now
        if self._tokens >= 1:
            self._tokens -= 1
            return True
        return False

allow = RateLimiter(max_per_sec=10)
if allow():                     # looks like a function call
    process(request)
\`\`\`

**Use \`__call__\` when** you need a "function with state". Otherwise, a closure or a regular method is clearer.`,
        },
        {
          q: "super() — the right way to call the parent",
          a: `\`super()\` isn't "the parent class" — it's the next class in the MRO. This matters for multiple inheritance.

\`\`\`python
class A:
    def greet(self):
        print("A.greet")

class B(A):
    def greet(self):
        super().greet()             # calls A.greet
        print("B.greet")

class C(A):
    def greet(self):
        super().greet()             # calls A.greet
        print("C.greet")

class D(B, C):                      # diamond inheritance
    def greet(self):
        super().greet()
        print("D.greet")

D().greet()
# A.greet
# C.greet    ← NOT "B then A then A". Super walks the MRO.
# B.greet
# D.greet

print(D.__mro__)
# (D, B, C, A, object)
\`\`\`

**Key insights:**
- \`super()\` walks the MRO, not the direct parent
- This enables **cooperative multiple inheritance** — each class passes control to the "next" one
- The MRO is computed by **C3 linearization** — deterministic, left-to-right, depth-first with cycle prevention
- All classes must call \`super().__init__(**kwargs)\` — otherwise the chain breaks

\`\`\`python
# Modern form (3.0+) — no arguments needed inside a method
class Child(Parent):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)    # calls Parent.__init__

# Python 2 / explicit form — rarely needed, useful in metaclasses
super(Child, self).__init__(*args, **kwargs)
\`\`\`

**Common trap:** \`super().__init__()\` is NOT optional in multiple inheritance. If \`D(B, C)\` and \`B.__init__\` doesn't call super, then \`C.__init__\` never runs — silent bug.`,
        },
      ],
    },

    // ============ DECORATORS ============
    {
      cat: "advanced",
      icon: <Sparkles size={18} />,
      title: "4. Decorators",
      level: "Mid → Senior",
      items: [
        {
          q: "What is a decorator? (Interview answer)",
          a: `A decorator is a **higher-order function that takes a function and returns a new function** — used to wrap/modify behavior without changing the original code. Relies on: functions are first-class objects + closures.

\`\`\`python
def my_decorator(func):
    def wrapper(*args, **kwargs):
        print(f"Before {func.__name__}")
        result = func(*args, **kwargs)
        print(f"After {func.__name__}")
        return result
    return wrapper

@my_decorator
def greet(name):
    return f"Hello, {name}"

greet("Alice")
# Before greet
# After greet
# → "Hello, Alice"
\`\`\`

\`@my_decorator\` is sugar for \`greet = my_decorator(greet)\`.`,
        },
        {
          q: "Decorator with arguments",
          a: `\`\`\`python
def repeat(n):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for _ in range(n):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(3)
def hello():
    print("hi")
\`\`\`

Three levels deep: \`repeat\` → \`decorator\` → \`wrapper\`.`,
        },
        {
          q: "Always use functools.wraps",
          a: `Without \`@wraps\`, the decorated function loses its original name, docstring, and signature.

\`\`\`python
from functools import wraps

def log(func):
    @wraps(func)                        # preserves metadata
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

@log
def add(a, b):
    """Adds two numbers."""
    return a + b

print(add.__name__)   # 'add'  (not 'wrapper')
print(add.__doc__)    # 'Adds two numbers.'
\`\`\``,
        },
        {
          q: "Class-based decorator",
          a: `\`\`\`python
class CountCalls:
    def __init__(self, func):
        self.func = func
        self.count = 0
    def __call__(self, *args, **kwargs):
        self.count += 1
        print(f"Call #{self.count}")
        return self.func(*args, **kwargs)

@CountCalls
def greet(): print("hi")

greet(); greet()   # Call #1, Call #2
\`\`\``,
        },
        {
          q: "Inspecting function attributes inside a decorator",
          a: `Every function is an object with useful attributes. A decorator can READ and USE them to make smart decisions.

\`\`\`python
import inspect
from functools import wraps

def describe(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print(f"name:      {func.__name__}")
        print(f"module:    {func.__module__}")
        print(f"doc:       {func.__doc__}")
        print(f"file:      {func.__code__.co_filename}")
        print(f"line:      {func.__code__.co_firstlineno}")
        print(f"args:      {func.__code__.co_varnames[:func.__code__.co_argcount]}")
        print(f"defaults:  {func.__defaults__}")
        print(f"annotations: {func.__annotations__}")
        print(f"signature: {inspect.signature(func)}")
        return func(*args, **kwargs)
    return wrapper

@describe
def add(a: int, b: int = 5) -> int:
    """Adds two numbers."""
    return a + b

add(2)
# name:      add
# doc:       Adds two numbers.
# args:      ('a', 'b')
# defaults:  (5,)
# annotations: {'a': <class 'int'>, 'b': <class 'int'>, 'return': <class 'int'>}
# signature: (a: int, b: int = 5) -> int
\`\`\`

**Why this matters:** frameworks like FastAPI, Flask, and pytest READ these attributes to generate routes, docs, and test parameters automatically.`,
        },
        {
          q: "Type-checking decorator (using annotations)",
          a: `A real use of function attributes — enforce type hints at runtime.

\`\`\`python
from functools import wraps
import inspect

def enforce_types(func):
    sig = inspect.signature(func)
    hints = func.__annotations__

    @wraps(func)
    def wrapper(*args, **kwargs):
        bound = sig.bind(*args, **kwargs)
        bound.apply_defaults()
        for name, value in bound.arguments.items():
            if name in hints and not isinstance(value, hints[name]):
                raise TypeError(
                    f"{func.__name__}: '{name}' expected {hints[name].__name__}, "
                    f"got {type(value).__name__}"
                )
        result = func(*args, **kwargs)
        if "return" in hints and not isinstance(result, hints["return"]):
            raise TypeError(f"{func.__name__}: return expected {hints['return'].__name__}")
        return result
    return wrapper

@enforce_types
def greet(name: str, times: int = 1) -> str:
    return f"Hi {name}! " * times

greet("Alice", 3)      # ok
greet("Alice", "3")    # TypeError: 'times' expected int, got str
\`\`\``,
        },
        {
          q: "Timing decorator — measure how long a function takes",
          a: `\`\`\`python
import time
from functools import wraps

def timeit(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        try:
            return func(*args, **kwargs)
        finally:
            elapsed = time.perf_counter() - start
            print(f"⏱  {func.__name__} took {elapsed*1000:.2f} ms")
    return wrapper

@timeit
def slow():
    time.sleep(0.1)
    return sum(range(10**6))

slow()   # ⏱  slow took 120.47 ms
\`\`\`

**Note:** \`try/finally\` ensures timing prints even if the function raises.`,
        },
        {
          q: "Logging decorator — log args, return, exceptions",
          a: `\`\`\`python
import logging
from functools import wraps

log = logging.getLogger(__name__)

def logged(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        arg_repr = [repr(a) for a in args]
        kw_repr  = [f"{k}={v!r}" for k, v in kwargs.items()]
        signature = ", ".join(arg_repr + kw_repr)
        log.info(f"→ {func.__name__}({signature})")
        try:
            result = func(*args, **kwargs)
            log.info(f"← {func.__name__} returned {result!r}")
            return result
        except Exception as e:
            log.exception(f"✗ {func.__name__} raised {e!r}")
            raise
    return wrapper

@logged
def divide(a, b):
    return a / b

divide(10, 2)    # logs call + return
divide(10, 0)    # logs call + exception, then re-raises
\`\`\``,
        },
        {
          q: "Memoization decorator (roll your own lru_cache)",
          a: `\`\`\`python
from functools import wraps

def memoize(func):
    cache = {}
    @wraps(func)
    def wrapper(*args, **kwargs):
        key = (args, frozenset(kwargs.items()))
        if key not in cache:
            cache[key] = func(*args, **kwargs)
        return cache[key]
    wrapper.cache = cache            # expose for inspection/clearing
    wrapper.cache_clear = cache.clear
    return wrapper

@memoize
def fib(n):
    return n if n < 2 else fib(n-1) + fib(n-2)

fib(100)          # instant — without memo, would take forever
print(len(fib.cache))    # 101 cached entries
fib.cache_clear()
\`\`\`

**Attaching attributes to \`wrapper\`** (\`wrapper.cache\`, \`wrapper.cache_clear\`) is idiomatic — that's how \`functools.lru_cache\` exposes \`.cache_info()\` and \`.cache_clear()\`.`,
        },
        {
          q: "Retry decorator with exponential backoff",
          a: `A real production pattern — retry flaky network calls.

\`\`\`python
import time, random
from functools import wraps

def retry(exceptions=(Exception,), attempts=3, base_delay=0.5, backoff=2.0):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            delay = base_delay
            last_exc = None
            for i in range(1, attempts + 1):
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    last_exc = e
                    if i == attempts:
                        raise
                    jitter = random.uniform(0, delay * 0.1)
                    print(f"attempt {i}/{attempts} failed ({e}); retry in {delay + jitter:.2f}s")
                    time.sleep(delay + jitter)
                    delay *= backoff
            raise last_exc
        return wrapper
    return decorator

@retry(exceptions=(ConnectionError, TimeoutError), attempts=5, base_delay=1.0)
def fetch(url):
    # simulate flaky API
    if random.random() < 0.7:
        raise ConnectionError("boom")
    return f"data from {url}"
\`\`\``,
        },
        {
          q: "Counting calls + exposing stats via wrapper attributes",
          a: `\`\`\`python
from functools import wraps

def count_calls(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        wrapper.calls += 1
        wrapper.last_args = (args, kwargs)
        return func(*args, **kwargs)
    wrapper.calls = 0
    wrapper.last_args = None
    wrapper.reset = lambda: setattr(wrapper, "calls", 0)
    return wrapper

@count_calls
def process(x): return x * 2

process(1); process(2); process(3)
print(process.calls)      # 3
print(process.last_args)  # ((3,), {})
process.reset()
print(process.calls)      # 0
\`\`\`

**Key trick:** attach state/methods TO the \`wrapper\` function itself. Functions are objects — you can set any attribute on them.`,
        },
        {
          q: "Stacking decorators — order matters!",
          a: `\`\`\`python
@timeit
@logged
@retry(attempts=3)
def work(x):
    return x

# Reads bottom-up. Equivalent to:
# work = timeit(logged(retry(attempts=3)(work)))
\`\`\`

**Execution order** when calling \`work(5)\`:
1. \`timeit\` wrapper starts timer
2. \`logged\` wrapper logs the call
3. \`retry\` wrapper tries the call
4. Actual \`work\` runs
5. Unwind in reverse

**Rule of thumb:** put the decorator whose effect you want OUTERMOST at the TOP. E.g., \`@timeit\` at top measures total time including retries.`,
        },
        {
          q: "Decorating a class method — self still works",
          a: `\`\`\`python
from functools import wraps

def auth_required(func):
    @wraps(func)
    def wrapper(self, *args, **kwargs):     # 'self' flows through naturally
        if not self.user:
            raise PermissionError("login required")
        return func(self, *args, **kwargs)
    return wrapper

class API:
    def __init__(self, user=None):
        self.user = user

    @auth_required
    def delete_account(self):
        print(f"deleting {self.user}")

API(user="alice").delete_account()   # ok
API().delete_account()               # PermissionError
\`\`\``,
        },
        {
          q: "Registering functions with a decorator (plugin pattern)",
          a: `A very common pattern — Flask routes, Django signals, event handlers.

\`\`\`python
handlers = {}

def on_event(name):
    def decorator(func):
        handlers[name] = func
        return func           # return UNCHANGED — decorator is just registering
    return decorator

@on_event("user.created")
def welcome_email(user):
    print(f"welcoming {user}")

@on_event("user.deleted")
def cleanup(user):
    print(f"cleaning up {user}")

# Dispatch
handlers["user.created"]({"name": "Alice"})
print(handlers)
# {'user.created': <welcome_email>, 'user.deleted': <cleanup>}
\`\`\``,
        },
        {
          q: "Real-world decorators you'll see",
          a: `- \`@property\` / \`@x.setter\` — computed attributes
- \`@staticmethod\` / \`@classmethod\` — method types
- \`@functools.lru_cache(maxsize=128)\` — memoization
- \`@functools.cached_property\` — lazy expensive attributes
- \`@dataclass\` — auto-generate \`__init__\`, \`__repr__\`, \`__eq__\`
- \`@app.route(...)\` — Flask routing
- \`@pytest.fixture\` — test fixtures
- \`@retry\` / \`@timing\` / \`@auth_required\` — custom patterns`,
        },
      ],
    },

    // ============ GENERATORS ============
    {
      cat: "advanced",
      icon: <Zap size={18} />,
      title: "5. Generators & Iterators",
      level: "Mid → Senior",
      items: [
        {
          q: "Iterator vs Iterable vs Generator — the full picture",
          a: `Three concepts interviewers regularly conflate. Get them straight.

**Iterable** — any object you can loop over. Implements \`__iter__\` which returns an iterator.
  Examples: \`list\`, \`tuple\`, \`dict\`, \`set\`, \`str\`, \`file\`, \`range\`, generators.

**Iterator** — the thing that tracks the CURRENT position. Implements \`__iter__\` (returns self) AND \`__next__\` (returns next value or raises \`StopIteration\`).

**Generator** — an iterator built via \`yield\`. Python generates the \`__iter__\`/\`__next__\` plumbing for you and freezes local state between yields.

\`\`\`python
# --- Iterable: can ask for an iterator ---
lst = [1, 2, 3]            # iterable
it = iter(lst)             # iterator (type: list_iterator)

# --- Iterator: advances via next() ---
next(it)                   # 1
next(it)                   # 2
next(it)                   # 3
next(it)                   # StopIteration

# --- What 'for x in lst' actually does ---
it = iter(lst)
while True:
    try:
        x = next(it)
    except StopIteration:
        break
    # body

# --- Manual iterator class (full protocol) ---
class Countdown:
    def __init__(self, start: int) -> None:
        self._cur = start
    def __iter__(self) -> "Countdown":
        return self             # iterator is its own iterator
    def __next__(self) -> int:
        if self._cur <= 0:
            raise StopIteration
        self._cur -= 1
        return self._cur + 1

for n in Countdown(3):     # 3, 2, 1
    print(n)

# --- Same behavior as a generator function — 3 lines instead of 8 ---
def countdown(start: int):
    while start > 0:
        yield start
        start -= 1
\`\`\`

**Iterable ≠ iterator.** You can call \`iter()\` on a list many times, getting fresh iterators each time. But calling \`iter()\` on an iterator returns itself — it's already the position tracker.

\`\`\`python
lst = [1, 2, 3]
iter(lst) is iter(lst)     # False — two separate iterators
it = iter(lst)
iter(it) is it             # True — iterator IS its own iterator
\`\`\`

**Why generators win 99% of the time:**
- Lazy — values on demand, memory-constant
- Composable — pipeline stages chain naturally
- Concise — no boilerplate \`__iter__\`/\`__next__\`
- Stateful — locals persist across yields`,
        },
        {
          q: "Fibonacci with a generator (classic question)",
          a: `The Fibonacci generator is interview bait — if they ask, they want to see you separate the INFINITE source from the BOUNDED consumer.

\`\`\`python
from __future__ import annotations
from typing import Iterator
from itertools import islice

# --- The source: infinite, O(1) memory ---
def fib() -> Iterator[int]:
    """Infinite Fibonacci sequence. Caller controls how many to consume."""
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

# --- The bounded variant ---
def fib_n(n: int) -> Iterator[int]:
    if n < 0:
        raise ValueError("n must be non-negative")
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

# --- Consume ---
list(islice(fib(), 10))                       # [0,1,1,2,3,5,8,13,21,34]
list(fib_n(10))                               # same
next(x for x in fib() if x > 10**6)           # first Fibonacci > 1M

# --- Memory stays O(1) even for massive indices ---
for i, v in enumerate(fib()):
    if i == 1_000_000:                        # millionth Fibonacci, no RAM issue
        break
\`\`\`

**Contrast with the memoized recursive version** (also classic interview):
\`\`\`python
from functools import lru_cache
@lru_cache(maxsize=None)
def fib_rec(n: int) -> int:
    return n if n < 2 else fib_rec(n-1) + fib_rec(n-2)
# Holds the whole cache in memory — O(n). Generator is O(1).
# Also: sys.setrecursionlimit may bite for large n.
\`\`\`

**Interview talking points:**
- Generator demonstrates lazy evaluation → O(1) memory
- Infinite source + bounded consumer is the Python idiom
- Don't write \`return [...]\` that builds a list the caller might not fully consume`,
        },
        {
          q: "Generator exhaustion — the #1 production bug",
          a: `A generator can only be consumed ONCE. After exhaustion, it yields nothing — silently.

\`\`\`python
gen = (x * 2 for x in range(5))
list(gen)             # [0, 2, 4, 6, 8]
list(gen)             # []  ← already exhausted, no error!

# The same trap with map/filter (they return iterators in Py3)
mapped = map(str, range(5))
list(mapped)          # ['0','1','2','3','4']
list(mapped)          # []

# And with file objects (files ARE iterators)
with open("data.txt") as f:
    first_pass = list(f)
    second_pass = list(f)    # [] — cursor at EOF
\`\`\`

**Real bug from production:**
\`\`\`python
# ❌ Silent bug — audit log is EMPTY second time
def process(records):
    filtered = (r for r in records if r.active)   # generator
    save_to_db(filtered)                           # consumes it
    send_to_audit(filtered)                        # gets NOTHING
\`\`\`

**Fixes:**
\`\`\`python
# 1. Materialize once into a list (if the data fits in memory)
filtered = [r for r in records if r.active]
save_to_db(filtered)
send_to_audit(filtered)                            # works

# 2. Use a FACTORY that returns a fresh generator each time
def make_filter(records):
    return (r for r in records if r.active)
save_to_db(make_filter(records))
send_to_audit(make_filter(records))                # fresh one

# 3. itertools.tee — split one iterator into N (careful with memory!)
from itertools import tee
a, b = tee(filtered, 2)
save_to_db(a)
send_to_audit(b)
# tee buffers values the slower consumer hasn't read yet — can blow up memory
\`\`\`

**Rule:** if you pass an iterator to multiple consumers, either materialize it or use a factory. If you "for x in gen" twice, the second loop does nothing.`,
        },
        {
          q: "Streaming a huge file — the canonical use case",
          a: `The #1 real-world generator use case: process files bigger than RAM.

\`\`\`python
from __future__ import annotations
from pathlib import Path
from typing import Iterator
import gzip, json, logging

log = logging.getLogger(__name__)

# ❌ Loads 10GB into memory — crashes
def bad_sum_errors(path: str) -> int:
    content = open(path, encoding="utf-8").read()
    return content.count("ERROR")

# ✅ O(1) memory, lazy per-line
def read_lines(path: str) -> Iterator[str]:
    """Stream lines from a file. Handles .gz transparently."""
    opener = gzip.open if path.endswith(".gz") else open
    with opener(path, "rt", encoding="utf-8", errors="replace") as f:
        for line in f:                     # ← file objects are iterators
            yield line.rstrip("\\n")

def parse_json_lines(path: str) -> Iterator[dict]:
    """JSON-Lines format — one JSON doc per line. S3, Kafka, BigQuery export."""
    for line in read_lines(path):
        if not line.strip():
            continue                       # skip blanks
        try:
            yield json.loads(line)
        except json.JSONDecodeError as e:
            log.warning("bad line: %s (%s)", line[:100], e)

def filter_errors(records: Iterator[dict]) -> Iterator[dict]:
    return (r for r in records if r.get("level") == "ERROR")

def count_by_service(records: Iterator[dict]) -> dict[str, int]:
    from collections import Counter
    return Counter(r["service"] for r in records if "service" in r)

# --- PIPELINE: each stage is O(1) memory ---
errors_by_service = count_by_service(
    filter_errors(
        parse_json_lines("/var/log/app.jsonl.gz")
    )
)
\`\`\`

**Key production points:**
- File objects are already iterators — \`for line in f\` is lazy
- Each pipeline stage is a generator → **total memory = one record at a time**
- \`errors="replace"\` prevents one malformed UTF-8 byte from killing the job
- Parse-and-skip bad records instead of aborting (\`log.warning\` + \`continue\`)
- Wrapping in \`gzip.open\` keeps the pipeline lazy even for compressed data`,
        },
        {
          q: "Generator pipelines — the Unix-pipe pattern in Python",
          a: `David Beazley's famous pattern: generators as composable pipeline stages. Each stage transforms a stream and passes it on.

\`\`\`python
from __future__ import annotations
from typing import Iterator, Iterable
import re

# --- Stage 1: read ---
def tail_f(path: str) -> Iterator[str]:
    """Mimic 'tail -f' — yield new lines as they appear."""
    import time
    with open(path) as f:
        f.seek(0, 2)                       # jump to end
        while True:
            line = f.readline()
            if not line:
                time.sleep(0.1)
                continue
            yield line.rstrip()

# --- Stage 2: filter ---
def grep(pattern: str, lines: Iterable[str]) -> Iterator[str]:
    regex = re.compile(pattern)
    return (l for l in lines if regex.search(l))

# --- Stage 3: transform ---
def extract_ip(lines: Iterable[str]) -> Iterator[str]:
    ip_re = re.compile(r"\\b(\\d{1,3}(?:\\.\\d{1,3}){3})\\b")
    for line in lines:
        if m := ip_re.search(line):
            yield m.group(1)

# --- Stage 4: aggregate ---
def top_n(items: Iterable[str], n: int = 10) -> list[tuple[str, int]]:
    from collections import Counter
    return Counter(items).most_common(n)

# --- COMPOSE — reads like shell: tail -f | grep | awk | sort | uniq -c ---
if __name__ == "__main__":
    log_lines = tail_f("/var/log/nginx/access.log")
    error_lines = grep(r" 5\\d\\d ", log_lines)         # HTTP 5xx
    error_ips = extract_ip(error_lines)
    # Only a HEAD of the stream: take 1000 then show top 10
    import itertools
    head = itertools.islice(error_ips, 1000)
    for ip, count in top_n(head):
        print(f"{count:4d}  {ip}")
\`\`\`

**Why this wins:**
- Each function does ONE thing → easy to test in isolation
- Memory stays O(1) regardless of log size
- Reordering/adding stages = one line change
- Stages compose — mock any stage with a list for tests

**Mental model:** \`func(lines)\` means "a function that transforms a stream of lines into another stream". Think Unix pipe operators.`,
        },
        {
          q: "yield from — delegation and flattening",
          a: `\`yield from\` does two things: **delegates** to another iterable, and (less commonly) **proxies** values between a caller and a sub-generator.

\`\`\`python
# --- 1. Simple delegation — equivalent but shorter ---
def sub():
    yield 1; yield 2; yield 3

def verbose():
    yield 0
    for x in sub():                  # manual delegation
        yield x
    yield 4

def concise():
    yield 0
    yield from sub()                 # same thing
    yield 4

list(concise())        # [0, 1, 2, 3, 4]
\`\`\`

**Production use: flattening nested structures.**
\`\`\`python
def flatten(items):
    """Recursively flatten arbitrarily-nested iterables, keeping strings atomic."""
    for x in items:
        if isinstance(x, (list, tuple, set)):
            yield from flatten(x)        # recursive delegation
        else:
            yield x

list(flatten([1, [2, [3, [4, [5]]]], "hello", (6, 7)]))
# [1, 2, 3, 4, 5, 'hello', 6, 7]
\`\`\`

**Production use: walking a directory tree.**
\`\`\`python
from pathlib import Path

def walk_py_files(root: Path):
    for path in root.iterdir():
        if path.is_dir() and not path.name.startswith("."):
            yield from walk_py_files(path)       # recurse into subdirs
        elif path.suffix == ".py":
            yield path

for f in walk_py_files(Path("src")):
    ...
\`\`\`

**Production use: combining sources.**
\`\`\`python
def all_users():
    yield from load_users_from_db()
    yield from load_users_from_csv("extra.csv")
    yield from load_users_from_api()
# Callers iterate ONE unified stream, caller doesn't care about sources.
\`\`\`

**The other thing \`yield from\` does:** it forwards \`.send()\`, \`.throw()\`, and return values between a caller and the sub-generator. Rarely used except in pre-async coroutine libraries.`,
        },
        {
          q: "Generators as coroutines — send, throw, close",
          a: `Generators aren't just for producing values — they can RECEIVE values via \`.send()\`. This is where Python's original async story started (before \`async/await\`).

\`\`\`python
def accumulator():
    total = 0
    while True:
        value = yield total           # ← yields total, receives next value
        if value is None:
            break
        total += value

acc = accumulator()
next(acc)                             # advance to first yield; returns 0
acc.send(5)                           # injects 5, returns 5
acc.send(3)                           # injects 3, returns 8
acc.send(10)                          # returns 18
acc.send(None)                        # triggers break → StopIteration
\`\`\`

**Full generator protocol:**
- \`next(g)\` or \`g.send(None)\` — advance one step
- \`g.send(value)\` — resume by SENDING a value into the \`yield\` expression
- \`g.throw(ExcType, msg)\` — raise an exception AT the yield point
- \`g.close()\` — raise \`GeneratorExit\` at yield → lets generator clean up

**Real use: a protocol state machine.**
\`\`\`python
def handshake():
    """Parse a simple hello/ack/bye protocol line by line."""
    msg = yield "READY"                          # send readiness, wait for next
    if msg != "HELLO":
        yield "ERROR"; return
    name = yield "OK, NAME?"
    yield f"HELLO, {name}"                       # final response
    return name

h = handshake()
print(next(h))            # READY
print(h.send("HELLO"))    # OK, NAME?
print(h.send("Alice"))    # HELLO, Alice
# next(h)                 # StopIteration(value="Alice") — 'return' value available
\`\`\`

**Why it matters for interviews:** shows you understand that modern \`async/await\` was built on top of generator-based coroutines (PEP 342). In modern code use \`async def\` — but understanding the mechanics earns senior points.`,
        },
        {
          q: "Context manager generators — @contextmanager explained",
          a: `\`@contextmanager\` turns a generator into a context manager. Code before \`yield\` is \`__enter__\`; code after (in a \`try/finally\`) is \`__exit__\`.

\`\`\`python
from contextlib import contextmanager
import time, logging

log = logging.getLogger(__name__)

@contextmanager
def timed(label: str):
    """Log how long a block takes, even if it raises."""
    start = time.perf_counter()
    try:
        yield                                    # ← 'with' body runs here
    finally:
        elapsed = time.perf_counter() - start
        log.info("%s took %.2f ms", label, elapsed * 1000)

with timed("db query"):
    rows = db.execute("SELECT ...")              # always logs time, even on error

# --- Real production pattern: DB transaction ---
@contextmanager
def transaction(conn):
    try:
        yield conn
        conn.commit()                            # commit on success
    except Exception:
        conn.rollback()                          # rollback on error
        raise                                    # re-raise to caller
    finally:
        conn.close()

with transaction(get_conn()) as conn:
    conn.execute("UPDATE users SET active = false WHERE id = ?", (uid,))
    # commit/rollback/close happen automatically
\`\`\`

**Why this is a generator:** \`yield\` is the hinge. One function reads as "setup, run, teardown" top-to-bottom — much clearer than writing \`__enter__\` and \`__exit__\` as separate methods.`,
        },
        {
          q: "itertools — the generator toolbox",
          a: `All of these return iterators — O(1) memory, composable, fast (C-implemented).

\`\`\`python
import itertools as it

# --- INFINITE GENERATORS (always combine with islice/takewhile) ---
it.count(10, 2)                 # 10, 12, 14, ...
it.cycle("ABC")                 # A, B, C, A, B, C, ...
it.repeat("x", 3)               # x, x, x

# --- WINDOWING & CHUNKING ---
list(it.pairwise([1,2,3,4]))        # [(1,2),(2,3),(3,4)]        (3.10+)
list(it.batched("ABCDEFG", 3))      # [('A','B','C'),('D','E','F'),('G',)]  (3.12+)

# Roll-your-own sliding window
from collections import deque
def window(seq, n):
    d = deque(maxlen=n)
    for item in seq:
        d.append(item)
        if len(d) == n: yield tuple(d)

# --- SLICING / LIMITING ---
list(it.islice(range(100), 10, 20, 2))       # [10, 12, 14, 16, 18]
list(it.takewhile(lambda x: x < 5, [1,3,5,2]))   # [1, 3]  (stops at 5)
list(it.dropwhile(lambda x: x < 5, [1,3,5,2]))   # [5, 2]  (starts from 5)

# --- CHAINING ---
list(it.chain([1,2], (3,4), {5}))                # [1,2,3,4,5]
list(it.chain.from_iterable([[1,2],[3,4]]))      # [1,2,3,4]  (flatten 1 level)

# --- GROUPING (requires pre-sorted input!) ---
data = [("a", 1), ("a", 2), ("b", 3), ("a", 4)]    # NOT sorted by key
for key, group in it.groupby(data, key=lambda x: x[0]):
    print(key, list(group))
# a [('a',1),('a',2)]      ← split because 'a' reappears AFTER 'b'
# b [('b',3)]
# a [('a',4)]
# Sort first if you want one group per key.

# --- ACCUMULATION (running totals) ---
list(it.accumulate([1,2,3,4]))                   # [1, 3, 6, 10]   (running sum)
list(it.accumulate([1,2,3,4], max))              # [1, 2, 3, 4]    (running max)
list(it.accumulate([1,2,3], initial=100))        # [100, 101, 103, 106]  (3.8+)

# --- COMBINATORICS ---
list(it.product([1,2], "AB"))                    # [(1,'A'),(1,'B'),(2,'A'),(2,'B')]
list(it.permutations([1,2,3], 2))                # all ordered pairs
list(it.combinations([1,2,3], 2))                # all unordered pairs

# --- ZIP VARIANTS ---
list(it.zip_longest([1,2], [3,4,5], fillvalue=0))    # [(1,3),(2,4),(0,5)]
list(zip([1,2,3], "AB", strict=True))                # ValueError! (3.10+)
\`\`\`

**Real patterns:**
\`\`\`python
# Chunk a huge list for batch DB inserts
for batch in it.batched(all_records, 1000):
    db.bulk_insert(batch)

# Sliding 7-day window over time series
for w in window(daily_values, 7):
    print(sum(w) / 7)              # 7-day moving average

# Flatten nested dict values
flat = list(it.chain.from_iterable(d.values()))
\`\`\``,
        },
        {
          q: "Generator vs list comprehension — memory & use cases",
          a: `\`\`\`python
# LIST comprehension — materialized, ALL in memory
squares = [x*x for x in range(10**8)]    # ~3 GB, possibly MemoryError

# GENERATOR expression — lazy, constant memory
squares = (x*x for x in range(10**8))    # O(1) memory, one value at a time

# When a function takes an iterable, drop the outer parens
sum(x*x for x in range(10**8))           # no intermediate list!
any(u.is_admin for u in users)           # short-circuits, never builds list
max((p.price for p in products), default=0)
\`\`\`

**Decision table:**

| Scenario | Use |
|---|---|
| Need to iterate once, memory matters | generator |
| Need to iterate multiple times | list |
| Need indexing / slicing / len() | list |
| Pipeline stage (feed to another function) | generator |
| Producing bounded, small result | list |
| Feeding to \`sum\`, \`any\`, \`all\`, \`min\`, \`max\`, \`join\` | generator (drop parens) |
| Passing to an API that consumes once (\`csv.writer\`, DB bulk_insert) | generator |

**Subtle performance note:** for SMALL collections (~under 1000 elements), a list comprehension is often FASTER because generator overhead dominates. Generators shine as soon as memory matters or when data is huge/unbounded.

**Set / dict comprehensions are always materialized** — no "generator" equivalent:
\`\`\`python
{x*x for x in range(10)}              # set comprehension
{k: v for k, v in pairs}              # dict comprehension
\`\`\``,
        },
        {
          q: "Paginated API client — generator flattens pages into records",
          a: `Classic production pattern: let the caller iterate over RECORDS; the generator fetches pages transparently.

\`\`\`python
from __future__ import annotations
from typing import Iterator
import httpx
import logging

log = logging.getLogger(__name__)

def fetch_all_users(
    client: httpx.Client,
    base_url: str,
    page_size: int = 100,
) -> Iterator[dict]:
    """Stream all users from a paginated API. O(1) memory regardless of total."""
    cursor: str | None = None
    while True:
        params = {"limit": page_size}
        if cursor:
            params["cursor"] = cursor

        resp = client.get(f"{base_url}/users", params=params, timeout=30)
        resp.raise_for_status()
        payload = resp.json()

        yield from payload["items"]           # flatten page → individual records

        cursor = payload.get("next_cursor")
        if not cursor:
            return                             # no more pages

# Usage — caller sees a flat stream of user dicts; doesn't care about pages
with httpx.Client() as client:
    admins = (u for u in fetch_all_users(client, "https://api.example.com")
              if u["role"] == "admin")
    for admin in admins:
        process(admin)                         # memory stays constant
\`\`\`

**What makes this production-grade:**
- Caller writes simple \`for u in fetch_all_users(...)\` — pagination is hidden
- Memory is O(page_size), not O(total records) — works for millions of rows
- Short-circuiting works: \`next(fetch_all_users(...))\` fetches ONE page, not all
- Easy to filter/transform with more generators (shown with the \`admins\` filter)
- Drop-in for \`csv.writer.writerows()\`, DB bulk insert, etc.

**Async version** — same idea with \`async def\` + \`async for\`:
\`\`\`python
async def fetch_all_users_async(client, base_url, page_size=100):
    cursor = None
    while True:
        resp = await client.get(...)
        payload = resp.json()
        for u in payload["items"]:
            yield u                            # async generator
        cursor = payload.get("next_cursor")
        if not cursor: return

async for u in fetch_all_users_async(client, url):
    ...
\`\`\``,
        },
        {
          q: "ETL / data pipeline — generator stages with resource cleanup",
          a: `Real ETL: read from DB → transform → write to S3. Each stage a generator; resources close automatically.

\`\`\`python
from __future__ import annotations
from contextlib import closing
from typing import Iterator
import csv, gzip, io, logging

log = logging.getLogger(__name__)

def read_users(conn) -> Iterator[dict]:
    """Stream rows from DB with server-side cursor."""
    with closing(conn.cursor(name="stream_users")) as cur:    # server-side cursor
        cur.itersize = 10_000
        cur.execute("SELECT id, email, created_at FROM users WHERE active")
        for row in cur:                                       # rows streamed in batches
            yield {"id": row[0], "email": row[1], "created_at": row[2]}

def anonymize(users: Iterator[dict]) -> Iterator[dict]:
    import hashlib
    for u in users:
        yield {
            "id": u["id"],
            "email_hash": hashlib.sha256(u["email"].encode()).hexdigest()[:16],
            "created_at": u["created_at"].isoformat(),
        }

def add_cohort(users: Iterator[dict]) -> Iterator[dict]:
    for u in users:
        u["cohort"] = u["created_at"][:7]       # '2026-01'
        yield u

def write_csv_gz(rows: Iterator[dict], path: str) -> int:
    """Write records to gzipped CSV. Returns count written."""
    count = 0
    with gzip.open(path, "wt", encoding="utf-8", newline="") as gz:
        writer = None
        for row in rows:
            if writer is None:                  # init on first row, with actual keys
                writer = csv.DictWriter(gz, fieldnames=list(row.keys()))
                writer.writeheader()
            writer.writerow(row)
            count += 1
            if count % 10_000 == 0:
                log.info("wrote %d rows", count)
    return count

# --- Composition — one line wires the whole pipeline ---
def export_users(conn, out_path: str) -> int:
    pipeline = add_cohort(anonymize(read_users(conn)))
    return write_csv_gz(pipeline, out_path)
\`\`\`

**Production properties:**
- Peak memory ≈ one row + CSV buffer → runs on tiny containers regardless of table size
- Each stage is pure-function-ish, trivially testable with a fake input list
- Server-side cursor (\`name="..."\` in psycopg) prevents the driver from pulling the whole result set
- \`gzip.open\` keeps compression lazy — no intermediate uncompressed file
- Periodic progress log (every 10k rows) — essential for long jobs`,
        },
        {
          q: "Infinite generators + early stop — where laziness really shines",
          a: `\`\`\`python
from itertools import count, islice, takewhile, dropwhile

# --- Find the first prime > 10**6 ---
def primes():
    yield 2
    for n in count(3, 2):
        if all(n % p for p in range(3, int(n**0.5) + 1, 2)):
            yield n

first_big_prime = next(p for p in primes() if p > 10**6)
# primes() never terminates, but next() stops at the first match.

# --- Retry with exponential backoff ---
def backoff_delays(base=1.0, factor=2.0, cap=60.0):
    delay = base
    while True:
        yield min(delay, cap)
        delay *= factor

import time
for attempt, delay in enumerate(backoff_delays(), 1):
    try:
        result = risky_call()
        break
    except TransientError:
        if attempt >= 5:
            raise
        time.sleep(delay)

# --- Generate IDs / sequence numbers ---
def id_generator(prefix):
    for n in count(1):
        yield f"{prefix}-{n:08d}"

next_id = id_generator("ORD").__next__
next_id()    # 'ORD-00000001'
next_id()    # 'ORD-00000002'

# --- Rate-limited timestamps ---
from datetime import datetime, timedelta
def every_minute(start: datetime):
    current = start
    while True:
        yield current
        current += timedelta(minutes=1)

# First 10 minute-stamps from now
stamps = list(islice(every_minute(datetime.utcnow()), 10))
\`\`\`

**Lesson:** infinite generators + \`itertools.islice\` / \`takewhile\` / \`next()\` is an extremely powerful combo. You express the RULE once ("all primes", "backoff schedule"), and the consumer decides WHEN to stop.`,
        },
        {
          q: "Async generators and `async for`",
          a: `Same shape as a regular generator, but \`async def\` + \`yield\`. Consumed with \`async for\`.

\`\`\`python
import asyncio, aiofiles

# --- Async generator: stream lines from a file without blocking ---
async def read_lines_async(path: str):
    async with aiofiles.open(path, encoding="utf-8") as f:
        async for line in f:
            yield line.rstrip()

async def count_errors(path: str) -> int:
    n = 0
    async for line in read_lines_async(path):
        if "ERROR" in line:
            n += 1
    return n

# --- Fan-out over many URLs, yielding results as they arrive ---
async def fetch_all(urls: list[str]):
    import httpx
    async with httpx.AsyncClient() as client:
        tasks = [asyncio.create_task(client.get(u)) for u in urls]
        for coro in asyncio.as_completed(tasks):
            resp = await coro
            yield resp.url, resp.status_code

async def main():
    async for url, status in fetch_all(urls):
        print(status, url)                    # handle as each one completes

# --- Async comprehension ---
async def collect():
    return [line async for line in read_lines_async("data.txt") if "ERROR" in line]
\`\`\`

**When to reach for async generators:** you have I/O-bound sources (DB cursors, HTTP streams, file reads) and want to yield items as they arrive WITHOUT blocking the event loop. Production use: Server-Sent Events, websocket message streams, Kafka consumers, paginated APIs.`,
        },
        {
          q: "Common generator pitfalls (interviewer bait)",
          a: `**1. Generators inside list comprehensions are still generators until you materialize them.**
\`\`\`python
gens = [(i*n for i in range(3)) for n in range(3)]   # list OF generators
[list(g) for g in gens]         # [[0,0,0], [0,1,2], [0,2,4]]
\`\`\`

**2. Late binding bites generator expressions too.**
\`\`\`python
funcs = [lambda: n for n in range(3)]
[f() for f in funcs]            # [2, 2, 2] — not [0,1,2]!
# Fix: lambda n=n: n

# But generators see the CURRENT value when iterated, not when defined:
n = 10
gen = (i + n for i in range(3))
n = 100
list(gen)                       # [100, 101, 102] — uses current n
\`\`\`

**3. \`return\` in a generator.**
\`\`\`python
def gen():
    yield 1
    yield 2
    return "done"                # becomes StopIteration.value
    yield 3                      # never reached

g = gen()
list(g)                          # [1, 2]
# 'done' is attached to StopIteration — accessible via g.send(...) + except
\`\`\`

**4. Generators hold references — watch out for memory.**
\`\`\`python
def process():
    big = load_10gb_blob()
    for item in stream():
        yield transform(item, big)   # generator keeps 'big' alive the entire time
\`\`\`
Fix: free the reference before entering the yield loop, or restructure.

**5. Exceptions inside generators halt them.**
\`\`\`python
def gen():
    yield 1
    raise ValueError("boom")
    yield 2

g = gen()
next(g)              # 1
next(g)              # ValueError
next(g)              # StopIteration — generator is finished
\`\`\`
Once it raises, it's done. Wrap in try/except inside the generator if you want to continue.

**6. \`tee\` can balloon memory.** If one branch consumes fast and the other slowly, \`tee\` buffers EVERY value the slow one hasn't read yet.

**7. Closing a generator with \`close()\`.** Raises \`GeneratorExit\` at yield — lets you clean up. Called automatically when the generator is garbage collected.

\`\`\`python
def tailing(f):
    try:
        while True:
            line = f.readline()
            if line: yield line
    except GeneratorExit:
        f.close()                 # clean up on .close() or GC
\`\`\``,
        },
      ],
    },

    // ============ CONCURRENCY ============
    {
      cat: "advanced",
      icon: <Cpu size={18} />,
      title: "6. Threading / Multiprocessing / Async — The GIL",
      level: "Senior",
      items: [
        {
          q: "The GIL — what it really is",
          a: `The **Global Interpreter Lock** is a mutex in CPython that allows **only one thread to execute Python bytecode at a time**, even on multi-core machines.

**Why does it exist?** CPython's memory management (reference counting) is not thread-safe. The GIL is a simple, fast way to protect it.

**Consequences:**
- Python threads CANNOT run CPU-bound Python code in true parallel
- Threads ARE useful for I/O-bound work — the GIL is released during I/O (file, network, sleep)
- C extensions (NumPy, Pandas) can release the GIL during heavy computation → real parallelism
- \`multiprocessing\` sidesteps the GIL by spawning separate processes, each with its own interpreter & GIL

**Python 3.13+** introduced an experimental no-GIL build (PEP 703). Still opt-in as of 2026.`,
        },
        {
          q: "Threading vs Multiprocessing vs Asyncio — decision matrix",
          a: `| Approach | Parallelism | Best for | Overhead |
|---|---|---|---|
| **threading** | concurrent, not parallel (GIL) | I/O-bound: HTTP requests, DB, file I/O | Low |
| **multiprocessing** | true parallel (separate processes) | CPU-bound: image processing, ML preprocessing, number crunching | High (fork + IPC) |
| **asyncio** | concurrent, single-threaded, cooperative | Massive I/O concurrency (10k+ sockets, web servers) | Lowest |
| **concurrent.futures** | API wrapper over threads/processes | Clean \`submit\`/\`map\` interface | Matches underlying |

**Quick rule:**
- Waiting on network/disk? → **async** (or threads)
- Crunching numbers? → **multiprocessing**
- Already using NumPy/Pandas? → check if it releases the GIL, threads may be fine

**Real production scenarios:**
- **Web scraper hitting 10,000 URLs** → \`asyncio + aiohttp\` (one thread, 10k concurrent sockets)
- **Resize 50,000 images** → \`multiprocessing.Pool\` (CPU-bound per image)
- **API server with DB calls** → async framework (FastAPI) or threaded (Flask/gunicorn)
- **Data pipeline with pandas transforms** → multiprocessing; pandas code is often GIL-bound when pure-Python, GIL-free when pure C`,
        },
        {
          q: "Multiprocessing example",
          a: `A realistic CPU-bound pipeline: process 10k images using all cores.

\`\`\`python
from __future__ import annotations
from concurrent.futures import ProcessPoolExecutor, as_completed
from pathlib import Path
import logging
import os

log = logging.getLogger(__name__)

def process_image(path: Path) -> tuple[Path, int]:
    """Pure function — CPU-bound work. Picklable, no shared state."""
    try:
        from PIL import Image
        with Image.open(path) as img:
            img.thumbnail((256, 256))
            out = path.with_suffix(".thumb.jpg")
            img.save(out, "JPEG", quality=85)
            return out, out.stat().st_size
    except Exception as e:
        log.exception("failed %s: %s", path, e)
        raise

def process_all(paths: list[Path], workers: int | None = None) -> list[Path]:
    workers = workers or os.cpu_count()
    results: list[Path] = []
    with ProcessPoolExecutor(max_workers=workers) as pool:
        futures = {pool.submit(process_image, p): p for p in paths}
        for fut in as_completed(futures):
            src = futures[fut]
            try:
                out, size = fut.result(timeout=30)
                results.append(out)
                log.info("done %s → %d bytes", src.name, size)
            except Exception:
                log.error("skipping %s", src)
    return results

if __name__ == "__main__":           # REQUIRED on Windows/macOS spawn
    logging.basicConfig(level=logging.INFO)
    paths = list(Path("photos").glob("*.jpg"))
    process_all(paths)
\`\`\`

**Production notes:**
- \`as_completed\` lets you handle results as they finish — don't wait for the slowest
- Always \`timeout\` on \`.result()\` so a hung worker doesn't freeze the pool
- Pure function + picklable args is the contract
- Guard with \`if __name__ == "__main__"\` — required for \`spawn\` start method
- Wrap per-task in try/except so one bad file doesn't kill the batch
- \`cpu_count()\` is a reasonable default; for I/O mixed with CPU, try \`2 * cpu_count()\``,
        },
        {
          q: "Asyncio example",
          a: `Production-grade: concurrent HTTP with bounded parallelism, timeouts, retries, and error isolation.

\`\`\`python
from __future__ import annotations
import asyncio
import logging
from typing import Any
import aiohttp

log = logging.getLogger(__name__)

class FetchError(Exception): ...

async def fetch_one(
    session: aiohttp.ClientSession,
    url: str,
    sem: asyncio.Semaphore,
    attempts: int = 3,
) -> dict[str, Any]:
    async with sem:                          # bound concurrency (e.g. 50 at a time)
        delay = 0.5
        for i in range(1, attempts + 1):
            try:
                async with session.get(url, timeout=aiohttp.ClientTimeout(total=10)) as r:
                    r.raise_for_status()
                    return await r.json()
            except (aiohttp.ClientError, asyncio.TimeoutError) as e:
                if i == attempts:
                    raise FetchError(f"{url} failed after {attempts} attempts") from e
                log.warning("retry %d/%d for %s: %s", i, attempts, url, e)
                await asyncio.sleep(delay)
                delay *= 2                   # exponential backoff

async def fetch_all(urls: list[str], concurrency: int = 50) -> list[dict | Exception]:
    sem = asyncio.Semaphore(concurrency)
    connector = aiohttp.TCPConnector(limit=concurrency, ttl_dns_cache=300)
    async with aiohttp.ClientSession(connector=connector) as session:
        tasks = [fetch_one(session, u, sem) for u in urls]
        # return_exceptions: don't let one failure cancel the whole batch
        return await asyncio.gather(*tasks, return_exceptions=True)

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    urls = [f"https://api.example.com/items/{i}" for i in range(1000)]
    results = asyncio.run(fetch_all(urls))
    ok = [r for r in results if not isinstance(r, Exception)]
    log.info("fetched %d / %d", len(ok), len(urls))
\`\`\`

**Key production patterns:**
- \`Semaphore\` bounds concurrency — hammering a server with 10k parallel requests gets you rate-limited or banned
- \`ClientTimeout\` prevents a hung request from blocking forever
- Retry loop with exponential backoff handles transient failures
- \`return_exceptions=True\` → one failure doesn't cancel the batch
- Shared \`ClientSession\` reuses TCP connections (huge perf win)
- \`TCPConnector(limit=…)\` caps total sockets`,
        },
        {
          q: "concurrent.futures — unified API",
          a: `\`\`\`python
from __future__ import annotations
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor, as_completed
import logging
import requests

log = logging.getLogger(__name__)

def download(url: str) -> tuple[str, bytes]:
    r = requests.get(url, timeout=10)
    r.raise_for_status()
    return url, r.content

def download_all(urls: list[str], workers: int = 20) -> dict[str, bytes]:
    """Download many URLs concurrently. Returns a dict of url → content.
    Failed URLs are logged but don't abort the batch."""
    results: dict[str, bytes] = {}
    with ThreadPoolExecutor(max_workers=workers, thread_name_prefix="dl") as ex:
        futures = {ex.submit(download, u): u for u in urls}
        for fut in as_completed(futures):
            url = futures[fut]
            try:
                u, content = fut.result(timeout=15)
                results[u] = content
            except Exception as e:
                log.warning("failed %s: %s", url, e)
    return results

# CPU-bound work — same API, different executor
# with ProcessPoolExecutor() as ex:
#     results = list(ex.map(compute_heavy, data, chunksize=100))
\`\`\`

**Production notes:**
- Prefer \`as_completed\` over \`map\` when you want to handle failures per-task
- \`thread_name_prefix\` makes logs/debuggers readable
- Always \`timeout\` on \`.result()\`
- For ProcessPoolExecutor + \`map\`, tune \`chunksize\` — tiny chunks thrash IPC, huge chunks kill parallelism`,
        },
        {
          q: "Race conditions — what they look like and how to fix",
          a: `A race condition happens when the outcome depends on the unpredictable order in which threads run.

**The classic: the \"check-then-act\" bug**
\`\`\`python
import threading

balance = 1000

def withdraw(amount: int) -> None:
    global balance
    if balance >= amount:          # ← Thread A passes this check
                                   # ← Thread B also passes this check (both see 1000!)
        balance -= amount          # ← Both subtract, balance goes NEGATIVE

# Run 10 threads, each trying to withdraw 200 from a balance of 1000
threads = [threading.Thread(target=withdraw, args=(200,)) for _ in range(10)]
for t in threads: t.start()
for t in threads: t.join()
print(balance)                     # Could be -1000 instead of stopping at 0
\`\`\`

**Fix 1: Lock**
\`\`\`python
balance = 1000
lock = threading.Lock()

def withdraw(amount: int) -> None:
    global balance
    with lock:                     # only one thread can be here at a time
        if balance >= amount:
            balance -= amount
\`\`\`

**Fix 2: Atomic operations via queue (usually cleaner)**
\`\`\`python
from queue import Queue
requests: Queue = Queue()

def worker():
    global balance
    while True:
        amount = requests.get()
        if amount is None: break
        if balance >= amount:
            balance -= amount
        requests.task_done()

# One worker thread pulls from the queue — no concurrent access
\`\`\`

**Other common race conditions:**

\`\`\`python
# 1. Lost updates on counters
counter += 1    # NOT atomic — read, increment, write. Use threading.Lock or itertools.count()

# 2. Double-submission
if not already_submitted(order_id):  # ← race window
    submit(order_id)                  # ← two threads can both submit
# Fix: database unique constraint + catch IntegrityError, or use lock

# 3. TOCTOU (Time-Of-Check to Time-Of-Use) — files
if os.path.exists(path):     # ← file might be deleted between check and open
    open(path)
# Fix: just try to open it and catch FileNotFoundError

# 4. Lazy initialization double-execution
if self._cache is None:
    self._cache = expensive_init()    # two threads both init!
# Fix: double-checked locking, or use threading.Event, or functools.cache
\`\`\`

**Where the GIL does and doesn't help:** single bytecode ops (list.append, dict[k]=v) are atomic. But \`counter += 1\` is THREE bytecodes (LOAD, ADD, STORE) and can be interrupted — not atomic.

**Debugging tip:** race bugs are timing-sensitive and non-reproducible. Use \`threading.enumerate()\` to see running threads, add logging, and shrink the window by increasing thread count.`,
        },
        {
          q: "Processing a huge (10GB+) log file efficiently",
          a: `Classic production question. The wrong answer is \`open(path).read()\` — that tries to load 10GB into RAM.

**Option 1: Stream line by line (single-threaded, memory-constant)**
\`\`\`python
from collections import Counter
import re

ERROR_RE = re.compile(r"\\bERROR\\b\\s+(\\w+)")

def count_error_codes(path: str) -> Counter:
    counts: Counter = Counter()
    with open(path, encoding="utf-8", errors="replace") as f:
        for line in f:                         # ← lazy, O(1) memory per line
            if "ERROR" not in line:
                continue                       # fast-path reject before regex
            if m := ERROR_RE.search(line):
                counts[m.group(1)] += 1
    return counts
\`\`\`

**Option 2: Parallel with multiprocessing (CPU-bound parsing)**
\`\`\`python
from multiprocessing import Pool
import os

def process_chunk(args) -> Counter:
    path, start, size = args
    counts: Counter = Counter()
    with open(path, "rb") as f:
        f.seek(start)
        if start != 0:
            f.readline()                        # skip partial line from prev chunk
        read = 0
        while read < size:
            line = f.readline()
            if not line: break
            read += len(line)
            s = line.decode("utf-8", errors="replace")
            if m := ERROR_RE.search(s):
                counts[m.group(1)] += 1
    return counts

def count_parallel(path: str, workers: int = 8) -> Counter:
    total = os.path.getsize(path)
    chunk = total // workers
    tasks = [(path, i * chunk, chunk) for i in range(workers)]
    tasks[-1] = (path, (workers - 1) * chunk, total - (workers - 1) * chunk)
    with Pool(workers) as pool:
        return sum(pool.map(process_chunk, tasks), Counter())
\`\`\`

**Option 3: Async streaming (many files / S3 / network logs)**
\`\`\`python
import asyncio, aiofiles

async def process_file(path: str, sem: asyncio.Semaphore) -> Counter:
    counts: Counter = Counter()
    async with sem:                                        # bound parallel file handles
        async with aiofiles.open(path, encoding="utf-8", errors="replace") as f:
            async for line in f:                           # lazy, async read
                if "ERROR" in line and (m := ERROR_RE.search(line)):
                    counts[m.group(1)] += 1
    return counts

async def main(paths: list[str]) -> Counter:
    sem = asyncio.Semaphore(20)
    results = await asyncio.gather(*(process_file(p, sem) for p in paths))
    return sum(results, Counter())

# asyncio.run(main(["/logs/app1.log", "/logs/app2.log", ...]))
\`\`\`

**Decision matrix:**

| Scenario | Best choice |
|---|---|
| One huge file, simple parsing | line-by-line streaming |
| One huge file, CPU-heavy regex/parsing | multiprocessing with byte-offset chunks |
| Many files / S3 / remote logs | async with aiofiles / s3fs |
| Structured logs / analytics | DuckDB, Polars, or load into ClickHouse |

**Key production tips:**
- ALWAYS iterate — never \`.read()\` on a big file
- Open in text mode with explicit \`encoding=\` and \`errors="replace"\` — one malformed byte kills the job otherwise
- For split-by-byte parallelism, always \`readline()\` after seeking to realign on line boundaries
- Stream aggregates (\`Counter\`) instead of accumulating lines
- For truly massive scale, don't use Python — use \`zcat ... | grep | awk\`, DuckDB, or a purpose-built log tool`,
        },
      ],
    },

    // ============ HASHING ============
    {
      cat: "advanced",
      icon: <Shield size={18} />,
      title: "7. Hashing in Python",
      level: "Mid → Senior",
      items: [
        {
          q: "What is a hash?",
          a: `A **hash** is a fixed-size integer derived from an object's contents via a deterministic function. Two rules:

1. **Consistent**: same input → same hash (within one Python run)
2. **Distribution**: different inputs → very likely different hashes (collisions are rare but possible)

\`\`\`python
hash("hello")      # -1267296259… (random per session for strings since Python 3.3)
hash(42)           # 42
hash((1, 2, 3))    # OK — tuple of hashables is hashable
hash([1, 2, 3])    # TypeError — lists are mutable → unhashable
\`\`\`

**Only immutable objects are hashable** by default, because mutating them would change their hash and break dict/set invariants.`,
        },
        {
          q: "How does it help? Dicts & sets",
          a: `Dicts and sets are **hash tables**. To find/insert a key:

1. Compute \`hash(key)\`
2. Convert to table index (modulo table size)
3. Look in that bucket — if collision, probe neighboring slots

This gives **O(1) average lookup** vs O(n) for lists. That's why \`x in dict\` is dramatically faster than \`x in list\` for big collections.

\`\`\`python
big_list = list(range(10**7))
big_set  = set(range(10**7))

9_999_999 in big_list   # ~0.3s  (linear scan)
9_999_999 in big_set    # ~0.0001s (hash lookup)
\`\`\``,
        },
        {
          q: "__hash__ and __eq__ contract",
          a: `If you override \`__eq__\`, you MUST override \`__hash__\` to stay consistent:

**Contract:** if \`a == b\` then \`hash(a) == hash(b)\`. The reverse need not hold.

\`\`\`python
class Point:
    def __init__(self, x, y): self.x, self.y = x, y
    def __eq__(self, o): return (self.x, self.y) == (o.x, o.y)
    def __hash__(self):  return hash((self.x, self.y))   # consistent with __eq__

s = {Point(1, 2), Point(1, 2)}
len(s)   # 1
\`\`\`

If you make a class mutable and hashable, and mutate it while in a set → corruption. Rule: hashable ⇒ immutable (or at least, the hashed fields are immutable).`,
        },
        {
          q: "Hash randomization (PYTHONHASHSEED)",
          a: `Since Python 3.3, string hashes are randomized per process to defend against hash-collision DoS attacks. That's why \`hash("abc")\` differs across runs. Set \`PYTHONHASHSEED=0\` to disable for debugging.`,
        },
      ],
    },

    // ============ GARBAGE COLLECTION ============
    {
      cat: "advanced",
      icon: <Flame size={18} />,
      title: "8. Garbage Collection",
      level: "Senior",
      items: [
        {
          q: "How does Python's GC work?",
          a: `Python uses a **two-tier** system:

**1. Reference counting** — primary mechanism. Every object has a refcount. When it hits 0, the object is immediately freed.

\`\`\`python
import sys
a = []
sys.getrefcount(a)   # 2 (one from 'a', one from getrefcount's arg)
b = a
sys.getrefcount(a)   # 3
del b
sys.getrefcount(a)   # 2
\`\`\`

**2. Generational cyclic GC** — handles reference CYCLES that refcounting can't free.

\`\`\`python
a = []; b = []
a.append(b); b.append(a)
del a, b      # refcounts still 1 each due to cycle → refcounting can't free
# the cyclic GC will eventually collect them
\`\`\`

The cyclic collector has 3 generations (0, 1, 2). New objects → gen 0. Survivors promote. Older generations collected less often (most objects die young — "generational hypothesis").`,
        },
        {
          q: "Controlling the GC",
          a: `\`\`\`python
import gc

gc.disable()            # turn off cyclic GC (refcounting still works)
gc.enable()
gc.collect()            # force a full collection
gc.get_stats()          # per-generation stats
gc.set_threshold(700, 10, 10)   # tune promotion thresholds
gc.get_objects()        # list all tracked objects (debugging)
\`\`\`

In very latency-sensitive code (real-time games, HFT), people disable GC and call \`gc.collect()\` at safe points.`,
        },
        {
          q: "Can I write a CUSTOM garbage collector?",
          a: `**Honest answer:** You can't replace Python's built-in GC (it's baked into CPython's C core). But you CAN build custom resource/lifecycle management — which is what "custom GC" means in practice.

**1. Context managers > \`__del__\`** — deterministic cleanup.
\`\`\`python
class Connection:
    def __init__(self, dsn: str) -> None:
        self._sock = open_socket(dsn)
    def __enter__(self):   return self
    def __exit__(self, *exc):
        self._sock.close()
        return False

with Connection("db://localhost") as conn:
    conn.query(...)
# closed deterministically, even on exception
\`\`\`

**Why not \`__del__\`?** It runs at an UNSPECIFIED time (not guaranteed to run at all at interpreter shutdown), doesn't run reliably in cycles, and exceptions inside it are SILENTLY ignored.

**2. \`weakref\` — caches that don't prevent collection.**
\`\`\`python
import weakref

class ImageCache:
    """Caches images but doesn't prolong their life.
    Once no one else holds a ref, the entry disappears."""
    def __init__(self) -> None:
        self._cache: weakref.WeakValueDictionary[str, Image] = weakref.WeakValueDictionary()
    def get(self, key: str) -> Image | None:
        return self._cache.get(key)
    def put(self, key: str, img: Image) -> None:
        self._cache[key] = img
\`\`\`

**3. Object pool — production-grade pattern (DB connections, HTTP clients, ML models).**
\`\`\`python
from __future__ import annotations
from contextlib import contextmanager
from queue import Queue, Empty
from typing import Callable, Generic, TypeVar
import logging, threading

log = logging.getLogger(__name__)
T = TypeVar("T")

class ResourcePool(Generic[T]):
    """Thread-safe bounded pool with health checks.
    Exhaustion blocks (with timeout) rather than spawning unbounded resources."""

    def __init__(
        self,
        factory: Callable[[], T],
        *,
        max_size: int = 10,
        health_check: Callable[[T], bool] | None = None,
        on_close: Callable[[T], None] | None = None,
    ) -> None:
        self._factory = factory
        self._health_check = health_check
        self._on_close = on_close
        self._max_size = max_size
        self._pool: Queue[T] = Queue(maxsize=max_size)
        self._created = 0
        self._lock = threading.Lock()

    def _acquire(self, timeout: float = 5.0) -> T:
        # Try to grab an idle one
        try:
            resource = self._pool.get_nowait()
            if self._health_check and not self._health_check(resource):
                log.info("discarding unhealthy resource")
                self._dispose(resource)
                return self._acquire(timeout)
            return resource
        except Empty:
            pass
        # Room to grow?
        with self._lock:
            if self._created < self._max_size:
                self._created += 1
                return self._factory()
        # Pool is full — wait for one to be released
        return self._pool.get(timeout=timeout)

    def _release(self, resource: T) -> None:
        self._pool.put_nowait(resource)

    def _dispose(self, resource: T) -> None:
        with self._lock:
            self._created -= 1
        if self._on_close:
            try: self._on_close(resource)
            except Exception: log.exception("on_close failed")

    @contextmanager
    def acquire(self, timeout: float = 5.0):
        resource = self._acquire(timeout)
        try:
            yield resource
        except Exception:
            # Don't return a potentially-broken resource to the pool
            self._dispose(resource)
            raise
        else:
            self._release(resource)

# Usage
db_pool = ResourcePool(
    factory=lambda: connect("postgres://..."),
    max_size=20,
    health_check=lambda c: c.ping(),
    on_close=lambda c: c.close(),
)

with db_pool.acquire() as conn:
    conn.execute("SELECT 1")
\`\`\`

**4. Tune the real GC for latency-sensitive code:**
\`\`\`python
import gc
gc.disable()                        # latency-critical sections
try:
    process_realtime_frame()
finally:
    gc.enable()
    gc.collect()                    # clean up at a safe point
\`\`\`

**Interview answer:** "I can't replace CPython's GC, but for production resource management I use context managers for deterministic cleanup, \`weakref\` for caches, object pools for expensive resources like DB connections, and I tune \`gc\` thresholds or toggle collection for latency-sensitive paths."`,
        },
      ],
    },

    // ============ ALGORITHMS ============
    {
      cat: "coding",
      icon: <Code2 size={18} />,
      title: "9. Coding Problems (Commonly Asked)",
      level: "Mid → Senior",
      items: [
        {
          q: "Balanced / Imbalanced Parentheses",
          a: `\`\`\`python
from __future__ import annotations

_PAIRS: dict[str, str] = {")": "(", "]": "[", "}": "{"}
_OPEN:  frozenset[str] = frozenset("([{")
_CLOSE: frozenset[str] = frozenset(")]}")

def is_balanced(s: str) -> bool:
    """Return True iff every opener has a matching closer in the right order."""
    stack: list[str] = []
    for ch in s:
        if ch in _OPEN:
            stack.append(ch)
        elif ch in _CLOSE:
            if not stack or stack.pop() != _PAIRS[ch]:
                return False
        # ignore any other character (letters, digits, whitespace)
    return not stack

# Tests
assert is_balanced("({[]})")     is True
assert is_balanced("({[})")      is False
assert is_balanced("((")         is False
assert is_balanced("")           is True
assert is_balanced("a(b[c]d)e")  is True   # ignores non-bracket chars
\`\`\`

**Complexity:** O(n) time, O(n) space worst case.
**Key idea:** stack — most recently opened bracket must close first (LIFO).
**Production touches:** constants hoisted as module-level frozensets (no re-allocation per call), type hints, inline assertions instead of prints, early return on empty/mismatched.`,
        },
        {
          q: "Longest Unique Substring (sliding window)",
          a: `\`\`\`python
from __future__ import annotations

def longest_unique(s: str) -> str:
    """Return the longest substring with all distinct characters.
    Returns the FIRST such substring when ties occur. Empty input → empty string.
    """
    if not s:
        return ""

    last_seen: dict[str, int] = {}   # char -> most recent index
    start = 0
    best_start = 0
    best_len = 0

    for i, ch in enumerate(s):
        prev = last_seen.get(ch, -1)
        if prev >= start:
            start = prev + 1         # shrink window past duplicate
        last_seen[ch] = i

        cur_len = i - start + 1
        if cur_len > best_len:
            best_len = cur_len
            best_start = start

    return s[best_start : best_start + best_len]

# Tests
assert longest_unique("abcabcbb") == "abc"
assert longest_unique("bbbbb")    == "b"
assert longest_unique("pwwkew")   == "wke"
assert longest_unique("")         == ""
assert longest_unique("a")        == "a"
assert longest_unique("dvdf")     == "vdf"
\`\`\`

**Complexity:** O(n) time, O(min(n, |Σ|)) space where Σ is the alphabet.
**Technique:** sliding window — keep a window \`[start, i]\` that contains only unique chars. When you see a duplicate WITHIN the window, jump \`start\` just past its previous position.
**Variation sometimes asked:** return the LENGTH only (don't reconstruct the substring) — then don't track \`best_start\`.`,
        },
        {
          q: "Dict → GET query string (optimized for big data)",
          a: `\`\`\`python
from __future__ import annotations
from typing import Any, Iterable, Mapping
from urllib.parse import urlencode, quote_plus

# --- Simple, correct, and optimal for most cases ---
def to_query(params: Mapping[str, Any]) -> str:
    """Standard lib — in C, handles lists, escaping, booleans, None."""
    # Filter None (don't send "key=None")
    clean = {k: v for k, v in params.items() if v is not None}
    return urlencode(clean, doseq=True, quote_via=quote_plus)

to_query({"q": "hello world", "page": 2, "tags": ["py", "dev"], "empty": None})
# 'q=hello+world&page=2&tags=py&tags=dev'
\`\`\`

**For VERY large dicts — streaming / memory-efficient build:**
\`\`\`python
def to_query_stream(params: Mapping[str, Any]) -> str:
    """Generator + ''.join — O(n) time, O(1) intermediate lists."""
    def pairs() -> Iterable[str]:
        for k, v in params.items():
            if v is None:
                continue
            k_enc = quote_plus(str(k))
            if isinstance(v, bool):
                yield f"{k_enc}={'true' if v else 'false'}"
            elif isinstance(v, (list, tuple, set, frozenset)):
                for item in v:
                    if item is None: continue
                    yield f"{k_enc}={quote_plus(str(item))}"
            else:
                yield f"{k_enc}={quote_plus(str(v))}"
    return "&".join(pairs())
\`\`\`

**Why \`"&".join(generator)\` over string concatenation?**
- \`s = s + x\` is **O(n²)** because strings are immutable — each concat copies
- \`"&".join(...)\` walks once, allocates once → **O(n)**
- Generator avoids materializing a huge list in memory

**Streaming to a sink — for truly huge payloads (millions of keys):**
\`\`\`python
def write_query(params: Mapping[str, Any], out) -> None:
    """Write directly to file/socket — constant memory regardless of size."""
    first = True
    for k, v in params.items():
        if v is None:
            continue
        items = v if isinstance(v, (list, tuple, set)) else (v,)
        k_enc = quote_plus(str(k))
        for item in items:
            if not first:
                out.write("&")
            out.write(f"{k_enc}={quote_plus(str(item))}")
            first = False

# Usage
with open("query.txt", "w") as f:
    write_query(huge_params, f)
\`\`\`

**Interview talking points:**
- \`urlencode\` exists and is fast (C implementation)
- Avoid \`s += "..."\` loops (O(n²))
- Use generators + \`join\` for O(n) memory
- Stream directly to sink for billion-key scale
- Handle: None filtering, booleans, nested lists, unicode, repeated keys`,
        },
        {
          q: "FizzBuzz (warmup) — scalable version",
          a: `The trap: interviewers often ask you to extend it to arbitrary rules.

\`\`\`python
from __future__ import annotations
from typing import Iterable

def fizzbuzz(n: int, rules: list[tuple[int, str]] | None = None) -> Iterable[str]:
    """Extensible FizzBuzz. Default rules: (3, 'Fizz'), (5, 'Buzz').
    Yields strings so the caller decides to print, join, or collect.
    """
    if n < 0:
        raise ValueError("n must be non-negative")
    rules = rules or [(3, "Fizz"), (5, "Buzz")]
    for i in range(1, n + 1):
        word = "".join(label for div, label in rules if i % div == 0)
        yield word or str(i)

# Classic
print("\\n".join(fizzbuzz(15)))

# Extended: add 7 → "Bazz"
print("\\n".join(fizzbuzz(21, [(3, "Fizz"), (5, "Buzz"), (7, "Bazz")])))
\`\`\`

**Why this beats the one-liner:** testable, composable, extensible to new rules without rewriting, yields lazily (works on \`n=10**9\`).`,
        },
        {
          q: "Two Sum — hash map",
          a: `\`\`\`python
from __future__ import annotations

def two_sum(nums: list[int], target: int) -> tuple[int, int] | None:
    """Return indices (i, j) with i < j such that nums[i] + nums[j] == target,
    or None if no such pair exists. O(n) time, O(n) space.
    """
    seen: dict[int, int] = {}                     # value -> index
    for i, n in enumerate(nums):
        complement = target - n
        if complement in seen:
            return (seen[complement], i)
        seen[n] = i
    return None

# Tests
assert two_sum([2, 7, 11, 15], 9) == (0, 1)
assert two_sum([3, 3], 6)         == (0, 1)        # duplicates OK
assert two_sum([1, 2, 3], 10)     is None
\`\`\`

O(n) vs brute force O(n²). Return \`None\` instead of raising — callers decide whether missing is an error.`,
        },
        {
          q: "Reverse a linked list (iterative + recursive)",
          a: `\`\`\`python
from __future__ import annotations
from dataclasses import dataclass
from typing import Optional

@dataclass
class Node:
    val: int
    next: Optional["Node"] = None

def reverse_iter(head: Optional[Node]) -> Optional[Node]:
    """O(n) time, O(1) space — the one to use in production."""
    prev: Optional[Node] = None
    curr = head
    while curr is not None:
        curr.next, prev, curr = prev, curr, curr.next
    return prev

def reverse_rec(head: Optional[Node]) -> Optional[Node]:
    """O(n) time, O(n) stack — watch for RecursionError on long lists."""
    if head is None or head.next is None:
        return head
    new_head = reverse_rec(head.next)
    head.next.next = head
    head.next = None
    return new_head
\`\`\`

**Always prefer iterative** in Python for linked lists — default recursion limit is 1000. For production code reviewing the iterative version, the three-way assignment (\`curr.next, prev, curr = prev, curr, curr.next\`) is idiomatic but some teams prefer the 4-line unrolled version for clarity.`,
        },
        {
          q: "Anagram detection",
          a: `\`\`\`python
from collections import Counter

# Best: O(n) — compare character frequencies
def is_anagram(a: str, b: str) -> bool:
    return Counter(a) == Counter(b)

# Also O(n log n) — works but slower
def is_anagram_sort(a: str, b: str) -> bool:
    return sorted(a) == sorted(b)

# Case-insensitive, ignore whitespace
def is_anagram_loose(a: str, b: str) -> bool:
    norm = lambda s: Counter(c.lower() for c in s if c.isalnum())
    return norm(a) == norm(b)

assert is_anagram("listen", "silent")
assert is_anagram_loose("The Eyes", "They See")
\`\`\``,
        },
        {
          q: "Palindrome check (multiple variants)",
          a: `\`\`\`python
def is_palindrome(s: str) -> bool:
    return s == s[::-1]

# More efficient — two pointers, O(1) extra space
def is_palindrome_tp(s: str) -> bool:
    i, j = 0, len(s) - 1
    while i < j:
        if s[i] != s[j]: return False
        i += 1; j -= 1
    return True

# Alphanumeric only, case-insensitive (the classic interview version)
def is_palindrome_clean(s: str) -> bool:
    i, j = 0, len(s) - 1
    while i < j:
        while i < j and not s[i].isalnum(): i += 1
        while i < j and not s[j].isalnum(): j -= 1
        if s[i].lower() != s[j].lower(): return False
        i += 1; j -= 1
    return True

assert is_palindrome_clean("A man, a plan, a canal: Panama")
\`\`\``,
        },
        {
          q: "Find duplicates in a list",
          a: `\`\`\`python
# --- All duplicates ---
def duplicates(lst: list) -> list:
    seen, dup = set(), set()
    for x in lst:
        (dup.add(x) if x in seen else seen.add(x))
    return list(dup)

# --- First duplicate ---
def first_duplicate(lst: list):
    seen = set()
    for x in lst:
        if x in seen: return x
        seen.add(x)
    return None

# --- Using Counter (if you want counts too) ---
from collections import Counter
counts = Counter(lst)
dups = [x for x, c in counts.items() if c > 1]

# --- Special case: array of 1..n with one duplicate (sum trick) ---
def find_duplicate_sum(nums: list[int], n: int) -> int:
    return sum(nums) - n * (n + 1) // 2
\`\`\``,
        },
        {
          q: "Flatten a nested list",
          a: `\`\`\`python
# --- One level only ---
from itertools import chain
flat = list(chain.from_iterable([[1,2],[3,4],[5]]))   # [1,2,3,4,5]

# --- Arbitrary depth, recursive ---
def flatten(lst):
    for item in lst:
        if isinstance(item, list):
            yield from flatten(item)
        else:
            yield item

list(flatten([1, [2, [3, [4, [5]]]], 6]))   # [1,2,3,4,5,6]

# --- Iterative (avoids recursion limit) ---
def flatten_iter(lst):
    stack = [iter(lst)]
    while stack:
        try:
            item = next(stack[-1])
        except StopIteration:
            stack.pop(); continue
        if isinstance(item, list):
            stack.append(iter(item))
        else:
            yield item
\`\`\``,
        },
        {
          q: "Merge intervals",
          a: `\`\`\`python
def merge_intervals(intervals: list[list[int]]) -> list[list[int]]:
    """Merge overlapping intervals. O(n log n) due to sort."""
    if not intervals: return []
    intervals.sort(key=lambda iv: iv[0])
    merged = [intervals[0]]
    for start, end in intervals[1:]:
        if start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return merged

assert merge_intervals([[1,3],[2,6],[8,10],[15,18]]) == [[1,6],[8,10],[15,18]]
\`\`\`

Classic follow-up: "insert a new interval into a sorted list without re-sorting" — O(n) version.`,
        },
        {
          q: "Binary search — the one you'll actually be asked",
          a: `\`\`\`python
from bisect import bisect_left, bisect_right, insort

# --- Manual binary search (know this cold) ---
def binary_search(arr: list[int], target: int) -> int:
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2          # avoid overflow in other languages
        if arr[mid] == target:   return mid
        elif arr[mid] <  target: lo = mid + 1
        else:                    hi = mid - 1
    return -1

# --- Use stdlib in production ---
from bisect import bisect_left
i = bisect_left(arr, target)
found = i < len(arr) and arr[i] == target

# --- Common variant: find leftmost index where condition holds ---
def lower_bound(arr, target):
    lo, hi = 0, len(arr)              # note: hi = len, not len-1
    while lo < hi:
        mid = (lo + hi) // 2
        if arr[mid] < target: lo = mid + 1
        else:                 hi = mid
    return lo

# insort keeps a list sorted
sorted_list = [1, 3, 5, 7]
insort(sorted_list, 4)                 # [1, 3, 4, 5, 7]
\`\`\`

**Traps:** off-by-one errors, infinite loops when \`mid\` computation is wrong, forgetting that \`bisect\` expects sorted input.`,
        },
        {
          q: "Top K elements — the heapq pattern",
          a: `\`\`\`python
import heapq
from collections import Counter

# Top K frequent
def top_k_frequent(nums: list[int], k: int) -> list[int]:
    return [x for x, _ in Counter(nums).most_common(k)]

# Generic top K largest — O(n log k)
def top_k_largest(nums: list[int], k: int) -> list[int]:
    return heapq.nlargest(k, nums)

# Top K smallest
def top_k_smallest(nums: list[int], k: int) -> list[int]:
    return heapq.nsmallest(k, nums)

# K-th largest — O(n log k) using min-heap of size k
def kth_largest(nums: list[int], k: int) -> int:
    heap = []
    for n in nums:
        heapq.heappush(heap, n)
        if len(heap) > k:
            heapq.heappop(heap)
    return heap[0]

# Streaming top K — use the min-heap approach when data is a generator
\`\`\`

**Why a min-heap for top K largest?** Keep the smallest of the top K at the root; push new, pop if larger. O(log k) per element, O(k) space — massively better than sorting the whole thing (O(n log n), O(n)).`,
        },
        {
          q: "LRU Cache from scratch",
          a: `\`\`\`python
from collections import OrderedDict

class LRUCache:
    """O(1) get and put using OrderedDict."""
    def __init__(self, capacity: int) -> None:
        if capacity <= 0:
            raise ValueError("capacity must be positive")
        self._cap = capacity
        self._data: OrderedDict[int, int] = OrderedDict()

    def get(self, key: int) -> int:
        if key not in self._data:
            return -1
        self._data.move_to_end(key)        # mark as recently used
        return self._data[key]

    def put(self, key: int, value: int) -> None:
        if key in self._data:
            self._data.move_to_end(key)
        elif len(self._data) >= self._cap:
            self._data.popitem(last=False)  # evict oldest
        self._data[key] = value

# Quick version using functools (if you can):
from functools import lru_cache
@lru_cache(maxsize=128)
def expensive(x): ...
\`\`\``,
        },
        {
          q: "Word frequency / map-reduce style",
          a: `\`\`\`python
from collections import Counter
import re

def word_count(text: str) -> dict[str, int]:
    """Normalize: lowercase, strip punctuation, split on whitespace."""
    words = re.findall(r"\\b[a-z']+\\b", text.lower())
    return Counter(words)

# Top 10 most common
Counter(words).most_common(10)

# Out-of-core for huge files: streaming
from collections import Counter
def word_count_file(path: str) -> Counter:
    counts = Counter()
    with open(path, encoding="utf-8") as f:
        for line in f:                     # O(1) memory per line
            counts.update(re.findall(r"\\b[a-z']+\\b", line.lower()))
    return counts
\`\`\``,
        },
        {
          q: "BFS / DFS on a graph",
          a: `\`\`\`python
from collections import deque

# Graph as adjacency list: {node: [neighbors]}
graph = {
    "A": ["B", "C"],
    "B": ["A", "D"],
    "C": ["A", "D", "E"],
    "D": ["B", "C"],
    "E": ["C"],
}

# --- BFS — shortest path in unweighted graph ---
def bfs(graph: dict, start, goal) -> list | None:
    queue = deque([(start, [start])])
    visited = {start}
    while queue:
        node, path = queue.popleft()
        if node == goal:
            return path
        for neighbor in graph.get(node, ()):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, path + [neighbor]))
    return None

# --- DFS iterative ---
def dfs(graph: dict, start) -> list:
    stack, visited, order = [start], {start}, []
    while stack:
        node = stack.pop()
        order.append(node)
        for neighbor in graph.get(node, ()):
            if neighbor not in visited:
                visited.add(neighbor)
                stack.append(neighbor)
    return order

# --- DFS recursive (careful with depth) ---
def dfs_rec(graph, node, visited=None, order=None):
    if visited is None: visited, order = set(), []
    visited.add(node); order.append(node)
    for neighbor in graph.get(node, ()):
        if neighbor not in visited:
            dfs_rec(graph, neighbor, visited, order)
    return order

# --- Cycle detection (directed graph) ---
def has_cycle(graph) -> bool:
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {n: WHITE for n in graph}
    def visit(n):
        color[n] = GRAY
        for m in graph.get(n, ()):
            if color.get(m) == GRAY: return True
            if color.get(m) == WHITE and visit(m): return True
        color[n] = BLACK
        return False
    return any(color[n] == WHITE and visit(n) for n in graph)
\`\`\``,
        },
        {
          q: "Valid binary search tree",
          a: `\`\`\`python
from dataclasses import dataclass
from typing import Optional

@dataclass
class TreeNode:
    val: int
    left: Optional["TreeNode"] = None
    right: Optional["TreeNode"] = None

# --- Classic: bounds propagation, O(n) ---
def is_valid_bst(root: Optional[TreeNode]) -> bool:
    def check(node, lo=float("-inf"), hi=float("inf")):
        if node is None: return True
        if not (lo < node.val < hi): return False
        return (check(node.left,  lo, node.val) and
                check(node.right, node.val, hi))
    return check(root)

# --- Alternative: in-order traversal must be strictly increasing ---
def is_valid_bst_inorder(root) -> bool:
    prev = [float("-inf")]
    def inorder(node):
        if node is None: return True
        if not inorder(node.left): return False
        if node.val <= prev[0]:    return False
        prev[0] = node.val
        return inorder(node.right)
    return inorder(root)
\`\`\``,
        },
        {
          q: "Matrix rotation (rotate 2D grid 90°)",
          a: `\`\`\`python
def rotate(m: list[list[int]]) -> None:
    """Rotate NxN matrix 90° clockwise, in place."""
    n = len(m)
    # Transpose
    for i in range(n):
        for j in range(i + 1, n):
            m[i][j], m[j][i] = m[j][i], m[i][j]
    # Reverse each row
    for row in m:
        row.reverse()

# One-liner (not in place, creates new list)
def rotated(m):
    return [list(row) for row in zip(*m[::-1])]
\`\`\``,
        },
        {
          q: "Producer/consumer with queue",
          a: `\`\`\`python
from queue import Queue
from threading import Thread
import time, random

SENTINEL = object()

def producer(q: Queue, n: int) -> None:
    for i in range(n):
        item = f"task-{i}"
        q.put(item)
        time.sleep(random.random() * 0.01)
    q.put(SENTINEL)        # signal done

def consumer(q: Queue) -> None:
    while True:
        item = q.get()
        if item is SENTINEL:
            q.put(SENTINEL)       # propagate to other consumers if multiple
            break
        print(f"processing {item}")
        q.task_done()

q: Queue = Queue(maxsize=100)
threads = [Thread(target=producer, args=(q, 50))]
threads += [Thread(target=consumer, args=(q,)) for _ in range(4)]
for t in threads: t.start()
for t in threads: t.join()
\`\`\`

**Production notes:** \`Queue\` is thread-safe; \`maxsize\` provides backpressure; use sentinels or \`queue.task_done()\` + \`q.join()\` for shutdown.`,
        },
        {
          q: "Stream median / running statistics",
          a: `\`\`\`python
import heapq

class RunningMedian:
    """Median of a stream — O(log n) add, O(1) median."""
    def __init__(self) -> None:
        self._lo: list[int] = []     # max-heap (negated)
        self._hi: list[int] = []     # min-heap

    def add(self, x: int) -> None:
        heapq.heappush(self._lo, -x)
        heapq.heappush(self._hi, -heapq.heappop(self._lo))
        if len(self._hi) > len(self._lo):
            heapq.heappush(self._lo, -heapq.heappop(self._hi))

    def median(self) -> float:
        if len(self._lo) > len(self._hi):
            return -self._lo[0]
        return (-self._lo[0] + self._hi[0]) / 2
\`\`\``,
        },
      ],
    },

    // ============ ARCHITECTURE PATTERNS ============
    {
      cat: "architecture",
      icon: <GitBranch size={18} />,
      title: "10. Architecture Patterns",
      level: "Senior",
      items: [
        {
          q: "SOLID principles — each letter with its own example",
          a: `The quick summary first, then each letter with a BAD → GOOD example.

- **S** — Single Responsibility: one class, one reason to change
- **O** — Open/Closed: open for extension, closed for modification
- **L** — Liskov Substitution: subclasses must behave like the parent
- **I** — Interface Segregation: many small interfaces > one fat one
- **D** — Dependency Inversion: depend on abstractions, not concretions

---

## 🇸 Single Responsibility Principle

**Rule:** a class should have ONE reason to change. Mixing responsibilities creates ripple-effect bugs.

\`\`\`python
# ❌ BAD — this class has THREE reasons to change:
#    1. User data model changes
#    2. Database technology changes
#    3. Email provider changes
class User:
    def __init__(self, name: str, email: str) -> None:
        self.name = name
        self.email = email

    def save_to_db(self) -> None:              # ← persistence responsibility
        conn = sqlite3.connect("app.db")
        conn.execute("INSERT INTO users ...", (self.name, self.email))

    def send_welcome_email(self) -> None:      # ← email responsibility
        smtp = smtplib.SMTP("mail.example.com")
        smtp.sendmail(...)
\`\`\`

\`\`\`python
# ✅ GOOD — split into three classes, each with ONE reason to change:

# Responsibility 1: represent a user (changes if data model changes)
@dataclass
class User:
    name: str
    email: str

# Responsibility 2: persist users (changes if DB changes)
class UserRepository:
    def save(self, user: User) -> None:
        conn = sqlite3.connect("app.db")
        conn.execute("INSERT INTO users ...", (user.name, user.email))

# Responsibility 3: send emails (changes if email provider changes)
class EmailService:
    def send_welcome(self, user: User) -> None:
        smtp = smtplib.SMTP("mail.example.com")
        smtp.sendmail(...)
\`\`\`

---

## 🇴 Open/Closed Principle

**Rule:** open for EXTENSION (add new behavior), closed for MODIFICATION (don't edit tested code).
Adding a new feature should mean ADDING a class, not EDITING an existing one.

\`\`\`python
# ❌ BAD — every new shape requires EDITING this class
class AreaCalculator:
    def area(self, shape) -> float:
        if shape.type == "circle":                           # ← edit here
            return 3.14 * shape.radius ** 2
        elif shape.type == "rectangle":                      # ← edit here
            return shape.width * shape.height
        elif shape.type == "triangle":                       # ← and here
            return 0.5 * shape.base * shape.height
        # Add a new shape? EDIT this function again. Risk breaking all shapes.
\`\`\`

\`\`\`python
# ✅ GOOD — add a new shape by ADDING a class. AreaCalculator NEVER changes.
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self) -> float: ...

class Circle(Shape):
    def __init__(self, radius: float) -> None: self.radius = radius
    def area(self) -> float: return 3.14 * self.radius ** 2

class Rectangle(Shape):
    def __init__(self, w: float, h: float) -> None: self.w, self.h = w, h
    def area(self) -> float: return self.w * self.h

# ← NEW SHAPE: just add a class. No existing code is touched.
class Triangle(Shape):
    def __init__(self, b: float, h: float) -> None: self.b, self.h = b, h
    def area(self) -> float: return 0.5 * self.b * self.h

def total_area(shapes: list[Shape]) -> float:
    return sum(s.area() for s in shapes)        # works for ANY Shape, forever
\`\`\`

---

## 🇱 Liskov Substitution Principle

**Rule:** if \`Child\` inherits from \`Parent\`, any code using \`Parent\` must work unchanged when given a \`Child\`. The child must not WEAKEN the contract.

\`\`\`python
# ❌ BAD — classic violation. Square IS-A Rectangle mathematically...
#    but not behaviorally. Setting width silently changes height — surprising!
class Rectangle:
    def __init__(self, w: float, h: float) -> None:
        self.width = w
        self.height = h

class Square(Rectangle):
    def __init__(self, side: float) -> None:
        super().__init__(side, side)
    @property
    def width(self): return self._w
    @width.setter
    def width(self, v):           # ← breaks the Rectangle contract
        self._w = self._h = v     #   setting width also mutates height!

def stretch(rect: Rectangle) -> None:
    rect.width = 10               # caller expects only width to change
    assert rect.width == 10
    assert rect.height == rect.height   # ← broken for Square

# This passes for Rectangle but fails subtly for Square → LSP violated.
\`\`\`

\`\`\`python
# ✅ GOOD — don't force a bad inheritance. Square and Rectangle are SIBLINGS.
class Shape(ABC):
    @abstractmethod
    def area(self) -> float: ...

class Rectangle(Shape):
    def __init__(self, w: float, h: float) -> None:
        self.width, self.height = w, h
    def area(self) -> float: return self.width * self.height

class Square(Shape):
    def __init__(self, side: float) -> None:
        self.side = side
    def area(self) -> float: return self.side ** 2
\`\`\`

**LSP test:** anywhere the parent works, the child must work too — same exceptions, same postconditions, same invariants. If a subclass needs to add surprising restrictions ("but don't call this method!"), you've violated LSP.

---

## 🇮 Interface Segregation Principle

**Rule:** clients should not be forced to depend on methods they don't use. Prefer many small focused interfaces over one fat one.

\`\`\`python
# ❌ BAD — a fat interface forces every implementer to support EVERYTHING,
#    even things that don't make sense for them.
class MultiFunctionDevice(Protocol):
    def print_doc(self, doc: bytes) -> None: ...
    def scan(self) -> bytes: ...
    def fax(self, doc: bytes, number: str) -> None: ...

# Now a simple printer is forced to implement fax and scan → NotImplementedError spam
class CheapPrinter:
    def print_doc(self, doc): ...
    def scan(self):                                    # ← doesn't have a scanner
        raise NotImplementedError("I only print")
    def fax(self, doc, number):                        # ← doesn't have a fax
        raise NotImplementedError("I only print")
\`\`\`

\`\`\`python
# ✅ GOOD — small, focused interfaces. Each device implements only what it does.
class Printer(Protocol):
    def print_doc(self, doc: bytes) -> None: ...

class Scanner(Protocol):
    def scan(self) -> bytes: ...

class Fax(Protocol):
    def fax(self, doc: bytes, number: str) -> None: ...

class CheapPrinter:                     # ← only implements Printer
    def print_doc(self, doc): ...

class OfficeAllInOne:                   # ← implements all three
    def print_doc(self, doc): ...
    def scan(self): ...
    def fax(self, doc, number): ...

# A function that only needs to print accepts ANY Printer — not a fat interface
def print_invoices(p: Printer, invoices: list[bytes]) -> None:
    for inv in invoices:
        p.print_doc(inv)
\`\`\`

---

## 🇩 Dependency Inversion Principle

**Rule:** high-level code should NOT depend on low-level code. Both should depend on ABSTRACTIONS. This makes swapping implementations (and testing) trivial.

\`\`\`python
# ❌ BAD — OrderService directly imports and creates SlackNotifier.
#    Can't test without Slack. Can't switch to email without editing OrderService.
import requests

class SlackNotifier:                                   # ← low-level (network, Slack API)
    def send(self, msg: str) -> None:
        requests.post("https://hooks.slack.com/...", json={"text": msg})

class OrderService:                                    # ← high-level (business logic)
    def __init__(self) -> None:
        self.notifier = SlackNotifier()                # ← HARD dependency on Slack
    def place_order(self, order_id: str) -> None:
        # ... business logic ...
        self.notifier.send(f"Order {order_id} placed")
\`\`\`

\`\`\`python
# ✅ GOOD — both sides depend on the Notifier abstraction.
from typing import Protocol

# The ABSTRACTION — a Protocol (structural interface)
class Notifier(Protocol):
    def send(self, message: str) -> None: ...

# Low-level concrete implementations — depend on the abstraction (the Protocol shape)
class SlackNotifier:
    def __init__(self, webhook: str) -> None: self.webhook = webhook
    def send(self, message: str) -> None:
        requests.post(self.webhook, json={"text": message})

class EmailNotifier:
    def __init__(self, smtp_host: str) -> None: self.smtp_host = smtp_host
    def send(self, message: str) -> None: ...

class NullNotifier:                                    # ← for tests, no mocks needed
    def send(self, message: str) -> None: ...

# High-level — depends on the abstraction, NOT on any concrete class
class OrderService:
    def __init__(self, notifier: Notifier) -> None:    # ← injected, not created
        self.notifier = notifier
    def place_order(self, order_id: str) -> None:
        self.notifier.send(f"Order {order_id} placed")

# Wire concrete implementations at the edge (main.py, FastAPI startup, etc.)
prod     = OrderService(SlackNotifier(webhook="https://..."))
staging  = OrderService(EmailNotifier(smtp_host="mail.corp"))
test     = OrderService(NullNotifier())                # ← swap for tests, one line
\`\`\`

**Why "inversion"?** Without DIP, dependencies point DOWN: high-level → low-level. With DIP, low-level concretions point UP at the abstraction that high-level code defines. The arrow is inverted.

---

## Interview tip — connect them

SOLID principles reinforce each other:
- **SRP** makes classes small → easier to apply OCP
- **OCP** relies on inheritance/polymorphism → LSP must hold
- **ISP** keeps Protocols small → DIP's abstractions stay clean
- **DIP** lets you swap implementations → makes testing trivial

The common thread is **"make change cheap"**. Every letter is about absorbing future changes without rewriting tested code.`,
        },
        {
          q: "Singleton — one instance only",
          a: `In Python, the simplest singleton is **a module** — modules are already loaded once and cached in \`sys.modules\`. Reach for classes only when you need state + methods bundled.

\`\`\`python
# config.py  ← the whole module IS the singleton
_settings: dict[str, str] = {}

def load() -> None:
    global _settings
    import os
    _settings = {k: v for k, v in os.environ.items() if k.startswith("APP_")}

def get(key: str, default: str | None = None) -> str | None:
    return _settings.get(key, default)

# Elsewhere:
# import config; config.load(); config.get("APP_DB_URL")
\`\`\`

**If you need a class — thread-safe Singleton via metaclass:**
\`\`\`python
import threading

class Singleton(type):
    _instances: dict[type, object] = {}
    _lock = threading.Lock()

    def __call__(cls, *args, **kwargs):
        with cls._lock:
            if cls not in cls._instances:
                cls._instances[cls] = super().__call__(*args, **kwargs)
        return cls._instances[cls]

class MetricsClient(metaclass=Singleton):
    def __init__(self, host: str = "localhost") -> None:
        self.host = host
        self._buffer: list[str] = []
    def emit(self, metric: str) -> None:
        self._buffer.append(metric)

a = MetricsClient("prod.example.com")
b = MetricsClient()          # same instance — host kwarg ignored after first call
assert a is b
\`\`\`

**Gotcha:** singletons are globally mutable state — they make testing and reasoning hard. Prefer dependency injection (pass the instance in) when possible.`,
        },
        {
          q: "Factory — create objects without naming the concrete class",
          a: `\`\`\`python
from __future__ import annotations
from abc import ABC, abstractmethod
from typing import Type

class StorageBackend(ABC):
    @abstractmethod
    def put(self, key: str, data: bytes) -> None: ...
    @abstractmethod
    def get(self, key: str) -> bytes: ...

class S3Backend(StorageBackend):
    def __init__(self, bucket: str) -> None: self.bucket = bucket
    def put(self, key: str, data: bytes) -> None: ...
    def get(self, key: str) -> bytes: ...

class LocalBackend(StorageBackend):
    def __init__(self, root: str) -> None: self.root = root
    def put(self, key: str, data: bytes) -> None: ...
    def get(self, key: str) -> bytes: ...

class InMemoryBackend(StorageBackend):
    def __init__(self) -> None: self._store: dict[str, bytes] = {}
    def put(self, key: str, data: bytes) -> None: self._store[key] = data
    def get(self, key: str) -> bytes: return self._store[key]

# --- Registry-based factory ---
_REGISTRY: dict[str, Type[StorageBackend]] = {
    "s3":     S3Backend,
    "local":  LocalBackend,
    "memory": InMemoryBackend,
}

def make_storage(kind: str, **kwargs) -> StorageBackend:
    try:
        cls = _REGISTRY[kind]
    except KeyError:
        raise ValueError(f"unknown backend {kind!r}, choose from {list(_REGISTRY)}")
    return cls(**kwargs)

# Caller decides from config — doesn't import the concrete class
storage = make_storage("s3", bucket="my-bucket")
# In tests:
storage = make_storage("memory")
\`\`\`

This is how \`logging.getLogger\`, SQLAlchemy dialects, Django DB backends all work.`,
        },
        {
          q: "Builder — construct complex objects step by step",
          a: `Useful when you have many optional params, multi-stage validation, or need fluent chaining.

\`\`\`python
from __future__ import annotations
from dataclasses import dataclass, field
from typing import Self

@dataclass(frozen=True)
class HttpRequest:
    method: str
    url: str
    headers: dict[str, str] = field(default_factory=dict)
    params: dict[str, str] = field(default_factory=dict)
    body: bytes | None = None
    timeout: float = 30.0

class RequestBuilder:
    def __init__(self, method: str, url: str) -> None:
        self._method = method
        self._url = url
        self._headers: dict[str, str] = {}
        self._params: dict[str, str] = {}
        self._body: bytes | None = None
        self._timeout: float = 30.0

    def header(self, key: str, value: str) -> Self:
        self._headers[key] = value
        return self

    def param(self, key: str, value: str) -> Self:
        self._params[key] = value
        return self

    def json(self, payload: dict) -> Self:
        import json
        self._body = json.dumps(payload).encode()
        self._headers["Content-Type"] = "application/json"
        return self

    def bearer(self, token: str) -> Self:
        return self.header("Authorization", f"Bearer {token}")

    def timeout(self, seconds: float) -> Self:
        if seconds <= 0:
            raise ValueError("timeout must be positive")
        self._timeout = seconds
        return self

    def build(self) -> HttpRequest:
        if not self._url.startswith(("http://", "https://")):
            raise ValueError(f"invalid url: {self._url}")
        return HttpRequest(
            method=self._method,
            url=self._url,
            headers=self._headers.copy(),
            params=self._params.copy(),
            body=self._body,
            timeout=self._timeout,
        )

# Fluent usage
req = (
    RequestBuilder("POST", "https://api.example.com/orders")
    .bearer("abc123")
    .header("X-Request-ID", "r-42")
    .json({"item": "widget", "qty": 3})
    .timeout(10.0)
    .build()
)
\`\`\``,
        },
        {
          q: "Adapter — wrap one interface as another",
          a: `When a third-party class has the WRONG shape for your codebase.

\`\`\`python
from __future__ import annotations
from typing import Protocol

# Your app expects this interface everywhere
class Cache(Protocol):
    def get(self, key: str) -> bytes | None: ...
    def set(self, key: str, value: bytes, ttl: int = 0) -> None: ...

# Third-party Redis client has a different API
class RedisClient:
    def fetch(self, k: str) -> bytes | None: ...
    def store(self, k: str, v: bytes, expires_sec: int | None = None) -> None: ...

# Adapter — makes Redis look like our Cache protocol
class RedisCacheAdapter:
    def __init__(self, redis: RedisClient) -> None:
        self._redis = redis
    def get(self, key: str) -> bytes | None:
        return self._redis.fetch(key)
    def set(self, key: str, value: bytes, ttl: int = 0) -> None:
        self._redis.store(key, value, expires_sec=ttl or None)

# Now the rest of the code never sees Redis-specific API
def get_user(cache: Cache, user_id: str) -> bytes | None:
    return cache.get(f"user:{user_id}")
\`\`\`

Use adapters at the BOUNDARY between your domain and external libraries — it keeps vendor lock-in from creeping into business logic.`,
        },
        {
          q: "Facade — one simple entry point over a complex subsystem",
          a: `\`\`\`python
from __future__ import annotations
import logging

log = logging.getLogger(__name__)

# --- Complex internals ---
class _PaymentGateway:
    def charge(self, card: str, amount: int) -> str: ...
class _InventorySystem:
    def reserve(self, sku: str, qty: int) -> str: ...
    def release(self, reservation_id: str) -> None: ...
class _ShippingService:
    def create_label(self, address: dict, sku: str) -> str: ...
class _EmailService:
    def send(self, to: str, template: str, **ctx) -> None: ...

# --- Facade: the ONE thing the rest of the app talks to ---
class OrderFacade:
    """Coordinates payment, inventory, shipping, email behind a single call."""

    def __init__(
        self,
        payments: _PaymentGateway,
        inventory: _InventorySystem,
        shipping: _ShippingService,
        email: _EmailService,
    ) -> None:
        self._payments = payments
        self._inventory = inventory
        self._shipping = shipping
        self._email = email

    def place_order(
        self, *, user_email: str, card: str, sku: str, qty: int,
        price_cents: int, address: dict,
    ) -> str:
        reservation = self._inventory.reserve(sku, qty)
        try:
            charge_id = self._payments.charge(card, price_cents * qty)
        except Exception:
            self._inventory.release(reservation)
            raise
        label = self._shipping.create_label(address, sku)
        self._email.send(user_email, "order_confirmation",
                         charge_id=charge_id, label=label)
        log.info("order placed: charge=%s label=%s", charge_id, label)
        return charge_id
\`\`\`

Controllers / API handlers call \`OrderFacade.place_order\` — they don't need to know about compensation logic, rollback on payment failure, or email templates.`,
        },
        {
          q: "Proxy — stand-in that controls access (lazy, caching, auth)",
          a: `\`\`\`python
from __future__ import annotations
from functools import cached_property
from typing import Any

class ExpensiveMLModel:
    def __init__(self, path: str) -> None:
        print(f"loading {path} ...")       # slow: minutes + GB of RAM
        # self._weights = load_large_weights(path)
    def predict(self, x: Any) -> Any: ...

# --- Lazy proxy: load only on first use ---
class LazyModelProxy:
    def __init__(self, path: str) -> None:
        self._path = path

    @cached_property
    def _model(self) -> ExpensiveMLModel:
        return ExpensiveMLModel(self._path)        # loaded once, cached

    def predict(self, x: Any) -> Any:
        return self._model.predict(x)

# --- Protection proxy: check auth before delegating ---
class AuthProxy:
    def __init__(self, inner, user) -> None:
        self._inner, self._user = inner, user
    def predict(self, x):
        if not self._user.is_authenticated:
            raise PermissionError("login required")
        return self._inner.predict(x)

# Usage — zero startup cost; model loads on first predict()
model = AuthProxy(LazyModelProxy("model.pt"), current_user)
\`\`\``,
        },
        {
          q: "Observer — pub/sub without global state",
          a: `\`\`\`python
from __future__ import annotations
from collections import defaultdict
from typing import Callable, Any
import logging

log = logging.getLogger(__name__)

Handler = Callable[[dict], None]

class EventBus:
    """Synchronous in-process pub/sub. For cross-process use Redis/Kafka."""

    def __init__(self) -> None:
        self._subscribers: dict[str, list[Handler]] = defaultdict(list)

    def subscribe(self, event: str, handler: Handler) -> Callable[[], None]:
        self._subscribers[event].append(handler)
        # return unsubscribe function — easier than tracking tokens
        def unsubscribe() -> None:
            try: self._subscribers[event].remove(handler)
            except ValueError: pass
        return unsubscribe

    def publish(self, event: str, payload: dict) -> None:
        for handler in list(self._subscribers.get(event, ())):
            try:
                handler(payload)
            except Exception:
                log.exception("handler failed for %s", event)
                # one bad subscriber should not break the others

# Usage
bus = EventBus()

def send_welcome(data: dict) -> None:
    print(f"emailing {data['email']}")

def add_to_crm(data: dict) -> None:
    print(f"crm add: {data['email']}")

bus.subscribe("user.created", send_welcome)
unsub = bus.subscribe("user.created", add_to_crm)

bus.publish("user.created", {"email": "a@b.com"})
unsub()                                # dynamic unsubscribe
\`\`\``,
        },
        {
          q: "Strategy — swap algorithms at runtime",
          a: `In Python this is often just "pass a function", but a Protocol + classes is cleaner when the algorithm has state or config.

\`\`\`python
from __future__ import annotations
from typing import Protocol
from decimal import Decimal

class PricingStrategy(Protocol):
    def price(self, base: Decimal, qty: int) -> Decimal: ...

class FlatPricing:
    def price(self, base: Decimal, qty: int) -> Decimal:
        return base * qty

class BulkDiscountPricing:
    def __init__(self, threshold: int, discount: Decimal) -> None:
        self.threshold = threshold
        self.discount = discount         # e.g. Decimal("0.10") for 10%
    def price(self, base: Decimal, qty: int) -> Decimal:
        total = base * qty
        return total * (1 - self.discount) if qty >= self.threshold else total

class TieredPricing:
    def __init__(self, tiers: list[tuple[int, Decimal]]) -> None:
        # sorted by min_qty ascending: [(1, 10.00), (10, 9.00), (100, 7.50)]
        self.tiers = sorted(tiers)
    def price(self, base: Decimal, qty: int) -> Decimal:
        unit = base
        for min_qty, tier_price in self.tiers:
            if qty >= min_qty:
                unit = tier_price
        return unit * qty

class Checkout:
    def __init__(self, pricing: PricingStrategy) -> None:
        self.pricing = pricing
    def total(self, base: Decimal, qty: int) -> Decimal:
        return self.pricing.price(base, qty)

# Swap at runtime based on customer tier, promo, etc.
checkout = Checkout(BulkDiscountPricing(threshold=10, discount=Decimal("0.15")))
checkout.pricing = TieredPricing([(1, Decimal("10")), (50, Decimal("8"))])
\`\`\``,
        },
        {
          q: "Command — encapsulate an action as an object",
          a: `Commands shine when you need **undo**, **queuing**, **logging**, or **replay**.

\`\`\`python
from __future__ import annotations
from abc import ABC, abstractmethod
from typing import Any

class Command(ABC):
    @abstractmethod
    def execute(self) -> None: ...
    @abstractmethod
    def undo(self) -> None: ...

class AddItemCommand(Command):
    def __init__(self, cart: list, item: Any) -> None:
        self._cart, self._item = cart, item
    def execute(self) -> None: self._cart.append(self._item)
    def undo(self) -> None:    self._cart.remove(self._item)

class RemoveItemCommand(Command):
    def __init__(self, cart: list, item: Any) -> None:
        self._cart, self._item = cart, item
        self._idx: int | None = None
    def execute(self) -> None:
        self._idx = self._cart.index(self._item)
        self._cart.pop(self._idx)
    def undo(self) -> None:
        if self._idx is not None:
            self._cart.insert(self._idx, self._item)

class CommandHistory:
    def __init__(self) -> None:
        self._done: list[Command] = []
    def run(self, cmd: Command) -> None:
        cmd.execute()
        self._done.append(cmd)
    def undo(self) -> None:
        if self._done: self._done.pop().undo()

cart: list[str] = []
history = CommandHistory()
history.run(AddItemCommand(cart, "apple"))
history.run(AddItemCommand(cart, "bread"))
history.undo()                           # bread removed
\`\`\`

Same pattern powers Celery/RQ tasks (commands serialized to a queue) and editor undo stacks.`,
        },
        {
          q: "Repository pattern — keep DB code out of business logic",
          a: `\`\`\`python
from __future__ import annotations
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Protocol

# --- Domain entity (no ORM imports!) ---
@dataclass
class User:
    id: int | None
    email: str
    name: str

# --- Interface — business logic depends on this ---
class UserRepository(Protocol):
    def get(self, user_id: int) -> User | None: ...
    def get_by_email(self, email: str) -> User | None: ...
    def save(self, user: User) -> User: ...
    def delete(self, user_id: int) -> None: ...

# --- SQLAlchemy implementation ---
class SqlAlchemyUserRepository:
    def __init__(self, session) -> None:
        self._session = session
    def get(self, user_id: int) -> User | None:
        row = self._session.get(_UserORM, user_id)
        return self._to_entity(row) if row else None
    def get_by_email(self, email: str) -> User | None:
        row = self._session.query(_UserORM).filter_by(email=email).one_or_none()
        return self._to_entity(row) if row else None
    def save(self, user: User) -> User:
        row = _UserORM(id=user.id, email=user.email, name=user.name)
        self._session.merge(row); self._session.flush()
        return self._to_entity(row)
    def delete(self, user_id: int) -> None:
        self._session.query(_UserORM).filter_by(id=user_id).delete()
    @staticmethod
    def _to_entity(row) -> User:
        return User(id=row.id, email=row.email, name=row.name)

# --- In-memory implementation for tests — no DB, no mocks ---
class InMemoryUserRepository:
    def __init__(self) -> None:
        self._data: dict[int, User] = {}
        self._next_id = 1
    def get(self, user_id: int) -> User | None:
        return self._data.get(user_id)
    def get_by_email(self, email: str) -> User | None:
        return next((u for u in self._data.values() if u.email == email), None)
    def save(self, user: User) -> User:
        if user.id is None:
            user = User(id=self._next_id, email=user.email, name=user.name)
            self._next_id += 1
        self._data[user.id] = user
        return user
    def delete(self, user_id: int) -> None:
        self._data.pop(user_id, None)

# --- Business logic depends only on the Protocol ---
class RegisterUser:
    def __init__(self, users: UserRepository) -> None:
        self._users = users
    def __call__(self, email: str, name: str) -> User:
        if self._users.get_by_email(email):
            raise ValueError(f"email {email} already registered")
        return self._users.save(User(id=None, email=email, name=name))
\`\`\`

**Why this wins:** tests instantiate \`RegisterUser(InMemoryUserRepository())\` — no test DB, no mocks, no fixtures. Production uses the SQL impl. Business logic has zero SQL knowledge.`,
        },
        {
          q: "MVC / MVT — Django's spin",
          a: `Classic **MVC**: Model (data), View (presentation), Controller (input handling).
**Django calls it MVT**: Model, View (= controller logic), Template (= presentation).

\`\`\`python
# --- Model (models.py) ---
from django.db import models

class Article(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()
    published_at = models.DateTimeField(auto_now_add=True)

# --- View (views.py) — despite the name, this is the CONTROLLER ---
from django.shortcuts import render, get_object_or_404

def article_detail(request, pk: int):
    article = get_object_or_404(Article, pk=pk)
    return render(request, "articles/detail.html", {"article": article})

# --- Template (articles/detail.html) — this is the VIEW ---
# <h1>{{ article.title }}</h1>
# <time>{{ article.published_at|date:"Y-m-d" }}</time>
# <div>{{ article.body|linebreaks }}</div>

# --- URL wiring (urls.py) ---
from django.urls import path
urlpatterns = [path("articles/<int:pk>/", article_detail, name="article_detail")]
\`\`\`

**Flask/FastAPI equivalent** is the same idea: route handler = controller, Jinja template / JSON response = view, SQLAlchemy/Pydantic models = model.`,
        },
        {
          q: "Hexagonal / Ports & Adapters",
          a: `Core domain is pure Python, knows **nothing** about DBs, HTTP, queues. I/O lives at the edges as **adapters** plugged into **ports** (interfaces).

\`\`\`
                       ┌────────────────────────┐
   HTTP handler ──────▶│                        │◀──── SQL repo
   CLI command  ──────▶│   CORE DOMAIN          │◀──── Redis cache
   Celery task  ──────▶│   (pure business rules)│◀──── SMTP sender
                       └────────────────────────┘
         (driving adapters)       (driven adapters)
\`\`\`

\`\`\`python
# --- Ports (interfaces the core depends on) ---
from typing import Protocol
class UserRepository(Protocol):
    def save(self, user) -> None: ...
class EmailSender(Protocol):
    def send(self, to: str, subject: str, body: str) -> None: ...

# --- Core domain (no imports of frameworks, no I/O) ---
class RegisterUser:
    def __init__(self, repo: UserRepository, email: EmailSender) -> None:
        self._repo = repo
        self._email = email
    def __call__(self, email: str, name: str) -> None:
        # pure business rules
        user = User(id=None, email=email.lower().strip(), name=name.strip())
        self._repo.save(user)
        self._email.send(user.email, "Welcome", f"Hi {user.name}!")

# --- Driving adapter (FastAPI route) ---
from fastapi import FastAPI
app = FastAPI()
@app.post("/users")
def create_user(payload: dict, register: RegisterUser = Depends(...)):
    register(payload["email"], payload["name"])
    return {"status": "ok"}

# --- Driven adapters (SQLAlchemy repo, SMTP sender) injected at startup ---
\`\`\`

Payoff: you can test the entire \`RegisterUser\` use case with in-memory adapters, and swap Postgres → MongoDB without touching business logic.`,
        },
        {
          q: "Clean Architecture — dependency rule (inward only)",
          a: `Entities ← Use cases ← Interface adapters ← Frameworks & drivers. **Inner layers must not import outer ones.**

\`\`\`
myapp/
├── domain/                  # ← innermost, no external deps
│   ├── entities.py          #   User, Order, Money
│   └── exceptions.py        #   DomainError, NotFound
├── application/             # ← use cases, depends only on domain
│   ├── ports.py             #   Protocols: UserRepository, EmailSender
│   └── use_cases.py         #   RegisterUser, PlaceOrder
├── infrastructure/          # ← adapters, depends on application + domain
│   ├── db/
│   │   └── sqlalchemy_repo.py
│   ├── email/
│   │   └── smtp_sender.py
│   └── queue/
│       └── celery_tasks.py
└── interfaces/              # ← HTTP/CLI, outermost
    ├── http/
    │   └── fastapi_app.py
    └── cli/
        └── commands.py
\`\`\`

**Rules enforced:**
- \`domain/\` imports nothing from the project
- \`application/\` imports only from \`domain/\`
- \`infrastructure/\` imports \`application/\` + \`domain/\`
- \`interfaces/\` wires everything at the edge

\`\`\`python
# domain/entities.py
from dataclasses import dataclass
@dataclass
class User:
    id: int | None; email: str; name: str

# application/ports.py
from typing import Protocol
from myapp.domain.entities import User
class UserRepository(Protocol):
    def save(self, user: User) -> User: ...

# application/use_cases.py
from myapp.domain.entities import User
from myapp.application.ports import UserRepository
class RegisterUser:
    def __init__(self, users: UserRepository) -> None: self._users = users
    def __call__(self, email: str, name: str) -> User:
        return self._users.save(User(None, email, name))

# interfaces/http/fastapi_app.py  — wires concrete impl into use case
from fastapi import FastAPI
from myapp.application.use_cases import RegisterUser
from myapp.infrastructure.db.sqlalchemy_repo import SqlAlchemyUserRepository
app = FastAPI()
register = RegisterUser(SqlAlchemyUserRepository(session=...))
@app.post("/users")
def create_user(email: str, name: str): return register(email, name)
\`\`\``,
        },
        {
          q: "Event-driven / CQRS / Event Sourcing",
          a: `**CQRS** = separate the write path (commands) from the read path (queries). Often paired with event sourcing, where state is derived by replaying events.

\`\`\`python
from __future__ import annotations
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any

# --- Events (immutable facts that happened) ---
@dataclass(frozen=True)
class OrderPlaced:
    order_id: str; customer_id: str; total_cents: int
    at: datetime = field(default_factory=datetime.utcnow)

@dataclass(frozen=True)
class OrderShipped:
    order_id: str; tracking: str
    at: datetime = field(default_factory=datetime.utcnow)

# --- Commands (intent to change state) ---
@dataclass(frozen=True)
class PlaceOrder:
    order_id: str; customer_id: str; total_cents: int

@dataclass(frozen=True)
class ShipOrder:
    order_id: str; tracking: str

# --- Aggregate rebuilds its state from events ---
class Order:
    def __init__(self) -> None:
        self.id: str | None = None
        self.status: str = "draft"
        self._changes: list[Any] = []

    @classmethod
    def replay(cls, events: list[Any]) -> "Order":
        order = cls()
        for e in events:
            order._apply(e)
        return order

    def _apply(self, event: Any) -> None:
        if isinstance(event, OrderPlaced):
            self.id, self.status = event.order_id, "placed"
        elif isinstance(event, OrderShipped):
            self.status = "shipped"

    def _record(self, event: Any) -> None:
        self._apply(event)
        self._changes.append(event)

    # --- Command handlers produce events ---
    def handle(self, cmd: Any) -> None:
        if isinstance(cmd, PlaceOrder):
            if self.status != "draft":
                raise ValueError("order already placed")
            self._record(OrderPlaced(cmd.order_id, cmd.customer_id, cmd.total_cents))
        elif isinstance(cmd, ShipOrder):
            if self.status != "placed":
                raise ValueError(f"cannot ship from {self.status}")
            self._record(OrderShipped(cmd.order_id, cmd.tracking))

    @property
    def pending(self) -> list[Any]: return list(self._changes)

# Usage
order = Order()
order.handle(PlaceOrder("o-1", "c-42", 9999))
order.handle(ShipOrder("o-1", "UPS-ABC"))
# persist order.pending to event store; publish to Kafka for read-model projections
\`\`\`

**When to use:** audit requirements, temporal queries ("what did the cart look like at 3pm?"), complex domains. **When to avoid:** simple CRUD — massive overkill.`,
        },
        {
          q: "ASGI vs WSGI — why FastAPI scales differently than Flask",
          a: `**WSGI** (sync) → one worker handles one request at a time. Needs many processes/threads for concurrency. Flask, Django (classic), Pyramid.

**ASGI** (async) → one worker handles thousands of concurrent requests via the event loop. FastAPI, Starlette, Django (modern), Quart.

\`\`\`python
# --- WSGI (Flask) — sync handler, blocks the worker ---
from flask import Flask
app = Flask(__name__)

@app.get("/users/<user_id>")
def get_user(user_id: str):
    user = db.query(user_id)           # blocks this worker
    profile = http.get(f"/profile/{user_id}").json()    # blocks again
    return {"user": user, "profile": profile}
# Run: gunicorn -w 8 app:app          ← 8 processes, each handles 1 req

# --- ASGI (FastAPI) — async handler, yields on I/O ---
from fastapi import FastAPI
import asyncpg, httpx

app = FastAPI()
pool: asyncpg.Pool
client: httpx.AsyncClient

@app.get("/users/{user_id}")
async def get_user(user_id: str):
    async with pool.acquire() as conn:
        user = await conn.fetchrow("SELECT ...", user_id)     # yields
    profile = (await client.get(f"/profile/{user_id}")).json()  # yields
    return {"user": user, "profile": profile}
# Run: uvicorn app:app --workers 4    ← 4 processes, each handles thousands of reqs
\`\`\`

**Rule of thumb:** if your handlers spend most time in I/O (DB, HTTP, queues), async wins big. If they're CPU-bound (image processing, ML inference), async gives no benefit — use multiprocessing.`,
        },
        {
          q: "Celery — background jobs done right",
          a: `\`\`\`python
# tasks.py
from __future__ import annotations
from celery import Celery
import logging, smtplib

log = logging.getLogger(__name__)
app = Celery("myapp", broker="redis://localhost:6379/0",
             backend="redis://localhost:6379/1")

app.conf.update(
    task_acks_late=True,               # ack only after success — survives worker crash
    task_reject_on_worker_lost=True,
    worker_prefetch_multiplier=1,      # long tasks → don't hoard queue
    task_time_limit=300,               # hard kill at 5 min
    task_soft_time_limit=270,          # raise SoftTimeLimitExceeded at 4.5 min
)

@app.task(
    bind=True,
    autoretry_for=(ConnectionError, TimeoutError),
    retry_backoff=True,                # exponential: 1, 2, 4, 8...
    retry_backoff_max=60,
    retry_jitter=True,
    max_retries=5,
)
def send_welcome_email(self, user_id: int) -> None:
    log.info("sending welcome to user=%s (attempt %d)", user_id, self.request.retries + 1)
    user = db.get_user(user_id)
    smtp = smtplib.SMTP("mail.example.com")
    try:
        smtp.sendmail("noreply@x.com", user.email, "Welcome!")
    finally:
        smtp.quit()

# Calling from web handler — fast, doesn't block the HTTP response
# send_welcome_email.delay(user_id=42)
\`\`\`

**Production settings that matter:**
- \`acks_late + reject_on_worker_lost\` → tasks not lost if worker dies mid-execution
- \`prefetch_multiplier=1\` → prevents one slow task from starving others
- \`autoretry_for\` + \`retry_backoff\` → handle transient errors automatically
- Soft + hard time limits → runaway tasks don't wedge workers forever
- Idempotent tasks — design so retries are safe`,
        },
        {
          q: "Pydantic — validation at the boundaries",
          a: `Validate UNTRUSTED data (HTTP requests, config, file inputs) at the edge. Inside the domain, use dataclasses.

\`\`\`python
from __future__ import annotations
from pydantic import BaseModel, Field, EmailStr, field_validator, ConfigDict
from decimal import Decimal
from datetime import datetime

class CreateOrderRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")   # reject unknown fields

    customer_id: int = Field(gt=0)
    email: EmailStr
    items: list[str] = Field(min_length=1, max_length=100)
    total: Decimal = Field(gt=Decimal("0"), max_digits=10, decimal_places=2)
    ship_by: datetime | None = None

    @field_validator("items")
    @classmethod
    def no_duplicates(cls, v: list[str]) -> list[str]:
        if len(v) != len(set(v)):
            raise ValueError("duplicate items not allowed")
        return v

# --- Settings from env vars (pydantic-settings) ---
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    db_url: str
    redis_url: str = "redis://localhost:6379/0"
    debug: bool = False
    secret_key: str = Field(min_length=32)

    model_config = ConfigDict(env_file=".env", env_prefix="APP_")

settings = Settings()         # fails loudly at startup if env is missing/bad
\`\`\`

**Usage with FastAPI** — validation happens automatically on every request:
\`\`\`python
@app.post("/orders")
def create_order(req: CreateOrderRequest):
    # req is already validated — bad requests rejected with 422 before this line
    ...
\`\`\`

**Rule:** Pydantic at the edges (HTTP, CLI, config, message queues), dataclasses in the core. Don't let Pydantic models leak into business logic — they're coupled to serialization concerns.`,
        },
        {
          q: "Python-specific architecture cheat sheet",
          a: `**When to pick what:**

| Situation | Choice |
|---|---|
| CRUD app, small team, fast shipping | Django (batteries included) |
| I/O-heavy API, high concurrency | FastAPI + async SQLAlchemy + asyncpg |
| Simple microservice, full control | Flask / Starlette |
| Long-running CPU-bound work | Celery + multiprocessing pool |
| Event-driven between services | Kafka / RabbitMQ + consumer workers |
| Data pipelines / ETL | Airflow / Prefect / Dagster |
| In-process caching | \`functools.lru_cache\`, \`cachetools\` |
| Distributed cache | Redis |

**Typical backend layout for a production Python service:**
\`\`\`
myapp/
├── domain/          # entities, value objects
├── application/     # use cases, ports (Protocols)
├── infrastructure/  # DB repos, HTTP clients, queue adapters
├── interfaces/      # FastAPI routes, CLI, Celery tasks
├── config.py        # pydantic-settings
└── main.py          # composition root — wires concrete impls
tests/
├── unit/            # domain + application, in-memory adapters
└── integration/     # with real DB/Redis (testcontainers)
\`\`\``,
        },
        {
          q: "Circuit Breaker — stop hammering a failing service",
          a: `When a downstream service is down, don't keep pounding it. Open the circuit, fail fast, try again later.

\`\`\`python
from __future__ import annotations
import time
import logging
import threading
from dataclasses import dataclass, field
from enum import Enum
from typing import Callable, TypeVar, ParamSpec
from functools import wraps

log = logging.getLogger(__name__)
P = ParamSpec("P")
R = TypeVar("R")

class State(Enum):
    CLOSED = "closed"        # normal — calls go through
    OPEN = "open"            # tripped — fail fast
    HALF_OPEN = "half_open"  # probing — one call allowed to test recovery

class CircuitBreakerError(Exception):
    """Raised when circuit is open."""

@dataclass
class CircuitBreaker:
    failure_threshold: int = 5
    recovery_timeout: float = 30.0
    expected_exceptions: tuple[type[Exception], ...] = (Exception,)

    _state: State = State.CLOSED
    _failures: int = 0
    _opened_at: float = 0.0
    _lock: threading.Lock = field(default_factory=threading.Lock)

    def _should_attempt_reset(self) -> bool:
        return time.monotonic() - self._opened_at >= self.recovery_timeout

    def _record_success(self) -> None:
        with self._lock:
            self._failures = 0
            self._state = State.CLOSED

    def _record_failure(self) -> None:
        with self._lock:
            self._failures += 1
            if self._failures >= self.failure_threshold:
                self._state = State.OPEN
                self._opened_at = time.monotonic()
                log.warning("circuit OPEN after %d failures", self._failures)

    def __call__(self, func: Callable[P, R]) -> Callable[P, R]:
        @wraps(func)
        def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
            with self._lock:
                if self._state == State.OPEN:
                    if self._should_attempt_reset():
                        self._state = State.HALF_OPEN
                        log.info("circuit HALF_OPEN — probing")
                    else:
                        raise CircuitBreakerError(
                            f"circuit open, retry in "
                            f"{self.recovery_timeout - (time.monotonic() - self._opened_at):.1f}s"
                        )

            try:
                result = func(*args, **kwargs)
            except self.expected_exceptions:
                self._record_failure()
                raise
            else:
                self._record_success()
                return result

        return wrapper

# Usage: wrap every call to a flaky dependency
payment_circuit = CircuitBreaker(
    failure_threshold=3,
    recovery_timeout=15.0,
    expected_exceptions=(ConnectionError, TimeoutError),
)

@payment_circuit
def charge(card_token: str, amount_cents: int) -> str:
    # if this raises 3 times, further calls fail fast for 15s
    return payments_api.charge(card_token, amount_cents)
\`\`\`

**Production use:** one breaker per downstream dependency. Expose state as a metric (\`circuit_state{service="payments"} = open|half_open|closed\`). Battle-tested library: \`pybreaker\`.`,
        },
        {
          q: "Idempotency keys — make retries safe",
          a: `External clients retry on network errors. Without idempotency, the user gets charged twice.

\`\`\`python
from __future__ import annotations
from dataclasses import dataclass
from datetime import datetime, timedelta
import hashlib
import json
import logging
from typing import Any, Callable, Protocol

log = logging.getLogger(__name__)

class IdempotencyStore(Protocol):
    def get(self, key: str) -> dict | None: ...
    def set_if_absent(self, key: str, value: dict, ttl: timedelta) -> bool: ...
    def finalize(self, key: str, response: dict) -> None: ...

@dataclass
class IdempotencyService:
    store: IdempotencyStore
    ttl: timedelta = timedelta(hours=24)

    def execute(
        self,
        key: str,
        request_body: dict[str, Any],
        handler: Callable[[], dict[str, Any]],
    ) -> dict[str, Any]:
        """Run handler at most once per (key, request_body) pair."""
        request_hash = self._hash(request_body)
        existing = self.store.get(key)

        if existing is not None:
            # Same key → must be same request body (else caller is buggy)
            if existing["request_hash"] != request_hash:
                raise ValueError(
                    f"idempotency key {key!r} reused with different request"
                )
            if existing["status"] == "completed":
                log.info("idempotent replay key=%s", key)
                return existing["response"]
            if existing["status"] == "in_progress":
                raise ConflictError("request already in progress")

        # Claim the key — returns False if someone else claimed it first
        claimed = self.store.set_if_absent(
            key,
            {"status": "in_progress", "request_hash": request_hash},
            ttl=self.ttl,
        )
        if not claimed:
            raise ConflictError("request already in progress")

        try:
            response = handler()
        except Exception:
            # Leave the key but mark failed — safe to retry
            self.store.finalize(key, {"status": "failed"})
            raise

        self.store.finalize(key, {"status": "completed", "response": response})
        return response

    @staticmethod
    def _hash(body: dict) -> str:
        canonical = json.dumps(body, sort_keys=True, separators=(",", ":"))
        return hashlib.sha256(canonical.encode()).hexdigest()

# Redis implementation of the store
class RedisIdempotencyStore:
    def __init__(self, redis): self._r = redis
    def get(self, key): raw = self._r.get(f"idem:{key}"); return json.loads(raw) if raw else None
    def set_if_absent(self, key, value, ttl):
        return bool(self._r.set(f"idem:{key}", json.dumps(value), ex=int(ttl.total_seconds()), nx=True))
    def finalize(self, key, response):
        self._r.set(f"idem:{key}", json.dumps(response), ex=int(self._r.ttl(f"idem:{key}") or 86400))

# HTTP handler usage
@app.post("/charges")
def create_charge(req: ChargeRequest, idempotency_key: str = Header(...)):
    return idempotency_service.execute(
        key=idempotency_key,
        request_body=req.model_dump(),
        handler=lambda: payments.charge(req.card, req.amount),
    )
\`\`\`

**Production rules:** TTL long enough for client retries (24h typical), hash the body to detect key reuse abuse, store in Redis/Postgres not memory (must survive restarts), idempotency applies to POST/PATCH — GET/PUT are already idempotent.`,
        },
        {
          q: "Unit of Work — group DB operations into one transaction",
          a: `Prevents half-committed state when a use case touches multiple repositories.

\`\`\`python
from __future__ import annotations
from typing import Protocol
from contextlib import contextmanager
import logging

log = logging.getLogger(__name__)

# --- Ports ---
class UserRepository(Protocol):
    def save(self, user): ...
    def get(self, user_id): ...

class OrderRepository(Protocol):
    def save(self, order): ...

class EventPublisher(Protocol):
    def publish(self, event): ...

class UnitOfWork(Protocol):
    users: UserRepository
    orders: OrderRepository
    events: list                        # events emitted during this UoW

    def __enter__(self): ...
    def __exit__(self, exc_type, exc, tb): ...
    def commit(self): ...
    def rollback(self): ...

# --- SQLAlchemy implementation ---
class SqlAlchemyUnitOfWork:
    def __init__(self, session_factory, publisher: EventPublisher):
        self._session_factory = session_factory
        self._publisher = publisher

    def __enter__(self):
        self._session = self._session_factory()
        self.users = SqlAlchemyUserRepository(self._session)
        self.orders = SqlAlchemyOrderRepository(self._session)
        self.events: list = []
        return self

    def __exit__(self, exc_type, exc, tb):
        if exc_type:
            self.rollback()
        self._session.close()

    def commit(self):
        self._session.commit()
        # Publish AFTER commit — so downstream can't see uncommitted state
        for event in self.events:
            try:
                self._publisher.publish(event)
            except Exception:
                log.exception("event publish failed: %s", event)
                # Note: this is where transactional outbox matters ↓

    def rollback(self):
        self._session.rollback()
        self.events.clear()

# --- Use case ---
class PlaceOrder:
    def __init__(self, uow_factory): self._uow_factory = uow_factory

    def __call__(self, user_id: int, items: list, total_cents: int):
        with self._uow_factory() as uow:
            user = uow.users.get(user_id)
            if not user:
                raise NotFound(f"user {user_id}")
            order = Order(user_id=user_id, items=items, total_cents=total_cents)
            uow.orders.save(order)
            uow.events.append(OrderPlaced(order_id=order.id, user_id=user_id))
            uow.commit()
            return order
        # if any step raised, rollback happened on __exit__

# Wiring
uow_factory = lambda: SqlAlchemyUnitOfWork(SessionLocal, kafka_publisher)
place_order = PlaceOrder(uow_factory)
\`\`\`

**Why this matters:** business logic never sees raw sessions, tests pass a fake UoW with in-memory repos, one transaction per use case call.`,
        },
        {
          q: "Transactional Outbox — reliable event publishing",
          a: `Problem: you commit the DB, then try to publish to Kafka — the publish fails. Now DB and queue are out of sync.

Solution: write the event in the SAME transaction as the state change, then a separate worker relays it.

\`\`\`python
from __future__ import annotations
from dataclasses import dataclass
from datetime import datetime
import json
import logging
import time

log = logging.getLogger(__name__)

# --- Schema ---
# CREATE TABLE outbox (
#   id BIGSERIAL PRIMARY KEY,
#   aggregate_id TEXT NOT NULL,
#   event_type TEXT NOT NULL,
#   payload JSONB NOT NULL,
#   created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
#   published_at TIMESTAMPTZ,
#   INDEX (published_at) WHERE published_at IS NULL
# );

# --- At write time: insert into outbox in SAME transaction ---
class PlaceOrder:
    def __call__(self, cmd: PlaceOrderCommand):
        with self._uow() as uow:
            order = Order(...)
            uow.orders.save(order)
            uow.session.execute(
                "INSERT INTO outbox (aggregate_id, event_type, payload) "
                "VALUES (%s, %s, %s::jsonb)",
                (str(order.id), "order.placed", json.dumps(cmd.__dict__)),
            )
            uow.commit()                   # atomic: both or neither

# --- Relay worker (separate process, runs continuously) ---
@dataclass
class OutboxRelay:
    session_factory: callable
    publisher: callable                    # Kafka producer, SNS, etc.
    batch_size: int = 100
    poll_interval: float = 1.0

    def run(self) -> None:
        while True:
            try:
                self._process_batch()
            except Exception:
                log.exception("outbox relay error")
            time.sleep(self.poll_interval)

    def _process_batch(self) -> None:
        with self.session_factory() as session:
            # SELECT FOR UPDATE SKIP LOCKED — multiple relay workers safe
            rows = session.execute("""
                SELECT id, event_type, payload
                FROM outbox
                WHERE published_at IS NULL
                ORDER BY id
                LIMIT %s
                FOR UPDATE SKIP LOCKED
            """, (self.batch_size,)).fetchall()

            if not rows:
                return

            for row in rows:
                try:
                    self.publisher(row.event_type, row.payload)
                except Exception:
                    log.exception("publish failed for outbox id=%s", row.id)
                    continue               # will retry next poll
                session.execute(
                    "UPDATE outbox SET published_at = now() WHERE id = %s",
                    (row.id,),
                )
            session.commit()
\`\`\`

**Guarantees:** at-least-once delivery (so downstream MUST be idempotent), atomic state+event, survives worker crashes. **Alternatives:** Debezium (CDC on the outbox table) for zero-code relay.`,
        },
        {
          q: "Saga — distributed transactions without 2PC",
          a: `Across multiple services, you can't do ACID. Use a saga: sequence of local transactions, each with a compensating action.

\`\`\`python
from __future__ import annotations
from dataclasses import dataclass, field
from typing import Callable, Any
import logging

log = logging.getLogger(__name__)

@dataclass
class SagaStep:
    name: str
    action: Callable[[dict], Any]
    compensate: Callable[[dict, Any], None]

@dataclass
class Saga:
    steps: list[SagaStep]
    _completed: list[tuple[SagaStep, Any]] = field(default_factory=list)

    def execute(self, context: dict) -> None:
        for step in self.steps:
            log.info("saga step: %s", step.name)
            try:
                result = step.action(context)
                self._completed.append((step, result))
            except Exception as e:
                log.exception("step %s failed — compensating", step.name)
                self._rollback(context)
                raise SagaFailed(step.name) from e

    def _rollback(self, context: dict) -> None:
        # Compensate in REVERSE order
        for step, result in reversed(self._completed):
            try:
                log.info("compensating: %s", step.name)
                step.compensate(context, result)
            except Exception:
                log.exception("compensation failed for %s — manual intervention needed", step.name)
                # In production: alert on-call, mark saga as stuck

class SagaFailed(Exception): ...

# --- Example: place order across 3 services ---
def reserve_inventory(ctx):     return inventory_api.reserve(ctx["sku"], ctx["qty"])
def release_inventory(ctx, reservation_id): inventory_api.release(reservation_id)

def charge_payment(ctx):        return payments_api.charge(ctx["card"], ctx["amount"])
def refund_payment(ctx, charge_id): payments_api.refund(charge_id)

def create_shipment(ctx):       return shipping_api.create(ctx["address"], ctx["sku"])
def cancel_shipment(ctx, ship_id):  shipping_api.cancel(ship_id)

place_order_saga = Saga(steps=[
    SagaStep("reserve_inventory", reserve_inventory, release_inventory),
    SagaStep("charge_payment",    charge_payment,    refund_payment),
    SagaStep("create_shipment",   create_shipment,   cancel_shipment),
])

place_order_saga.execute({"sku": "SKU-1", "qty": 1, "card": "...", "amount": 9999, "address": {...}})
\`\`\`

**Production reality:** sagas need persistence (store progress so you can resume after a crash), orchestration frameworks like Temporal or dapr handle this for real systems. This pattern is for illustration — don't hand-roll it for critical flows.`,
        },
        {
          q: "Rate Limiting — token bucket algorithm",
          a: `\`\`\`python
from __future__ import annotations
import time
import threading
from dataclasses import dataclass
from typing import Protocol

class RateLimiter(Protocol):
    def allow(self, key: str) -> bool: ...

# --- In-process token bucket (for single-worker use) ---
@dataclass
class TokenBucket:
    capacity: int                          # max tokens
    refill_per_sec: float                  # tokens added per second
    _tokens: float = 0.0
    _last: float = 0.0
    _lock: threading.Lock = None

    def __post_init__(self):
        self._tokens = float(self.capacity)
        self._last = time.monotonic()
        self._lock = threading.Lock()

    def allow(self, cost: float = 1.0) -> bool:
        with self._lock:
            now = time.monotonic()
            elapsed = now - self._last
            self._tokens = min(self.capacity, self._tokens + elapsed * self.refill_per_sec)
            self._last = now
            if self._tokens >= cost:
                self._tokens -= cost
                return True
            return False

# --- Distributed rate limiter using Redis (atomic via Lua script) ---
_LUA_SCRIPT = """
local key      = KEYS[1]
local capacity = tonumber(ARGV[1])
local refill   = tonumber(ARGV[2])
local now      = tonumber(ARGV[3])
local cost     = tonumber(ARGV[4])

local data   = redis.call('HMGET', key, 'tokens', 'last')
local tokens = tonumber(data[1]) or capacity
local last   = tonumber(data[2]) or now

local elapsed = math.max(0, now - last)
tokens = math.min(capacity, tokens + elapsed * refill)

local allowed = 0
if tokens >= cost then
    tokens = tokens - cost
    allowed = 1
end

redis.call('HMSET', key, 'tokens', tokens, 'last', now)
redis.call('EXPIRE', key, 3600)
return allowed
"""

class RedisTokenBucket:
    def __init__(self, redis, capacity: int, refill_per_sec: float):
        self._redis = redis
        self._capacity = capacity
        self._refill = refill_per_sec
        self._script = redis.register_script(_LUA_SCRIPT)

    def allow(self, key: str, cost: float = 1.0) -> bool:
        result = self._script(
            keys=[f"ratelimit:{key}"],
            args=[self._capacity, self._refill, time.time(), cost],
        )
        return result == 1

# --- Middleware (FastAPI example) ---
from fastapi import Request, HTTPException

limiter = RedisTokenBucket(redis_client, capacity=100, refill_per_sec=10)

@app.middleware("http")
async def rate_limit(request: Request, call_next):
    client_id = request.headers.get("X-API-Key") or request.client.host
    if not limiter.allow(f"api:{client_id}"):
        raise HTTPException(429, "rate limit exceeded")
    return await call_next(request)
\`\`\`

**Notes:** Lua script makes it atomic (no TOCTOU race between read and write); use per-key limits (user/IP/API key); expose 429 + \`Retry-After\` header; production libraries: \`slowapi\`, \`limits\`, cloud-native: Envoy/NGINX.`,
        },
        {
          q: "Health checks — liveness, readiness, startup",
          a: `Kubernetes needs THREE probes, not one. Conflating them causes cascading failures.

\`\`\`python
from __future__ import annotations
from dataclasses import dataclass
from typing import Callable, Awaitable
import asyncio
import logging
from fastapi import FastAPI, Response
import time

log = logging.getLogger(__name__)
app = FastAPI()

@dataclass
class HealthCheck:
    name: str
    check: Callable[[], Awaitable[bool]]
    critical: bool = True                  # failing non-critical = degraded, not down
    timeout: float = 3.0

class HealthRegistry:
    def __init__(self) -> None:
        self._checks: list[HealthCheck] = []
        self._startup_complete = False

    def register(self, check: HealthCheck) -> None:
        self._checks.append(check)

    def mark_started(self) -> None:
        self._startup_complete = True

    async def run_checks(self) -> dict:
        async def run_one(hc: HealthCheck):
            start = time.monotonic()
            try:
                ok = await asyncio.wait_for(hc.check(), timeout=hc.timeout)
            except Exception as e:
                log.warning("health check %s failed: %s", hc.name, e)
                ok = False
            return hc, ok, time.monotonic() - start

        results = await asyncio.gather(*(run_one(hc) for hc in self._checks))
        return {
            hc.name: {"ok": ok, "critical": hc.critical, "duration_ms": round(d * 1000, 1)}
            for hc, ok, d in results
        }

registry = HealthRegistry()

# --- Register concrete checks ---
async def check_db():    conn = await pool.acquire();   await conn.execute("SELECT 1"); await pool.release(conn); return True
async def check_redis(): return (await redis.ping())
async def check_kafka(): return kafka_admin.describe_cluster().timeout(2).result() is not None

registry.register(HealthCheck("db",    check_db,    critical=True))
registry.register(HealthCheck("redis", check_redis, critical=True))
registry.register(HealthCheck("kafka", check_kafka, critical=False))     # degraded, not down

# --- /livez: am I alive? should I be restarted? ---
@app.get("/livez")
def livez():
    # ONLY checks the process itself. NOT dependencies.
    # If this fails, k8s restarts the pod — don't cascade.
    return {"status": "ok"}

# --- /readyz: should I receive traffic right now? ---
@app.get("/readyz")
async def readyz(response: Response):
    if not registry._startup_complete:
        response.status_code = 503
        return {"status": "starting"}

    results = await registry.run_checks()
    critical_failed = any(not r["ok"] for r in results.values() if r["critical"])
    response.status_code = 503 if critical_failed else 200
    return {"status": "fail" if critical_failed else "ok", "checks": results}

# --- /startupz: long one-time warmup complete? ---
@app.get("/startupz")
async def startupz(response: Response):
    response.status_code = 200 if registry._startup_complete else 503
    return {"started": registry._startup_complete}

@app.on_event("startup")
async def warmup():
    await preload_ml_model()
    await warm_connection_pools()
    registry.mark_started()
\`\`\`

**Rules:**
- **liveness** — just "is my process responding" (checks NO dependencies). Fails → restart pod.
- **readiness** — "ready for traffic RIGHT NOW". Fails → remove from load balancer (don't restart).
- **startup** — "one-time init done" (model load, cache warm). Prevents liveness/readiness from failing during slow startup.`,
        },
        {
          q: "Graceful shutdown — don't drop in-flight requests",
          a: `\`\`\`python
from __future__ import annotations
import asyncio
import signal
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI

log = logging.getLogger(__name__)

class LifecycleManager:
    def __init__(self) -> None:
        self._shutdown_event = asyncio.Event()
        self._tasks: set[asyncio.Task] = set()
        self._shutting_down = False

    def track(self, coro):
        """Track a background task so shutdown waits for it."""
        task = asyncio.create_task(coro)
        self._tasks.add(task)
        task.add_done_callback(self._tasks.discard)
        return task

    @property
    def shutting_down(self) -> bool:
        return self._shutting_down

    async def shutdown(self, timeout: float = 30.0) -> None:
        log.info("graceful shutdown starting (timeout=%ss)", timeout)
        self._shutting_down = True
        self._shutdown_event.set()

        # Stop accepting new work (app sees shutting_down=True, returns 503 on /readyz)
        # Give k8s time to remove us from the load balancer
        await asyncio.sleep(5)

        # Wait for in-flight tasks to complete
        if self._tasks:
            log.info("waiting for %d in-flight tasks", len(self._tasks))
            try:
                await asyncio.wait_for(
                    asyncio.gather(*self._tasks, return_exceptions=True),
                    timeout=timeout,
                )
            except asyncio.TimeoutError:
                log.warning("shutdown timeout — cancelling %d tasks", len(self._tasks))
                for t in self._tasks:
                    t.cancel()

        # Close pools, flush logs, etc.
        await close_db_pool()
        await close_redis()
        await kafka_producer.flush(timeout=10)
        log.info("graceful shutdown complete")

lifecycle = LifecycleManager()

@asynccontextmanager
async def app_lifespan(app: FastAPI):
    # Startup
    loop = asyncio.get_event_loop()
    for sig in (signal.SIGTERM, signal.SIGINT):
        loop.add_signal_handler(sig, lambda: asyncio.create_task(lifecycle.shutdown()))
    yield
    # Shutdown (runs if not already triggered by signal)
    if not lifecycle.shutting_down:
        await lifecycle.shutdown()

app = FastAPI(lifespan=app_lifespan)

# Readiness probe returns 503 during shutdown — k8s drains traffic
@app.get("/readyz")
async def readyz():
    if lifecycle.shutting_down:
        return Response(status_code=503)
    return {"status": "ok"}
\`\`\`

**The sequence that matters:** SIGTERM → flip readyz to 503 → wait for LB drain (~5s) → wait for in-flight → close pools → exit. Without this, every deploy drops ~0.1-1% of requests.`,
        },
        {
          q: "Retry with Jitter — distributed retry done right",
          a: `\`\`\`python
from __future__ import annotations
import random
import time
import asyncio
from dataclasses import dataclass
from typing import Callable, TypeVar
import logging

log = logging.getLogger(__name__)
T = TypeVar("T")

@dataclass
class RetryPolicy:
    max_attempts: int = 5
    base_delay: float = 0.5
    max_delay: float = 30.0
    exponential_base: float = 2.0
    jitter: str = "full"                   # "none", "equal", "full", "decorrelated"
    retryable: tuple[type[Exception], ...] = (ConnectionError, TimeoutError)

    def _compute_delay(self, attempt: int, last_delay: float) -> float:
        cap = min(self.max_delay, self.base_delay * (self.exponential_base ** attempt))
        if self.jitter == "none":
            return cap
        elif self.jitter == "equal":
            return cap / 2 + random.uniform(0, cap / 2)
        elif self.jitter == "full":
            return random.uniform(0, cap)
        elif self.jitter == "decorrelated":
            return min(self.max_delay, random.uniform(self.base_delay, last_delay * 3))
        raise ValueError(self.jitter)

    def sync(self, fn: Callable[[], T]) -> T:
        last_delay = self.base_delay
        for attempt in range(self.max_attempts):
            try:
                return fn()
            except self.retryable as e:
                if attempt == self.max_attempts - 1:
                    raise
                last_delay = self._compute_delay(attempt, last_delay)
                log.warning("retry %d/%d after %.2fs: %s",
                            attempt + 1, self.max_attempts, last_delay, e)
                time.sleep(last_delay)
        raise RuntimeError("unreachable")

    async def aio(self, fn: Callable[[], Awaitable[T]]) -> T:
        last_delay = self.base_delay
        for attempt in range(self.max_attempts):
            try:
                return await fn()
            except self.retryable as e:
                if attempt == self.max_attempts - 1:
                    raise
                last_delay = self._compute_delay(attempt, last_delay)
                log.warning("retry %d/%d after %.2fs: %s",
                            attempt + 1, self.max_attempts, last_delay, e)
                await asyncio.sleep(last_delay)
        raise RuntimeError("unreachable")

# Usage
policy = RetryPolicy(max_attempts=5, base_delay=0.5, jitter="full")

user = policy.sync(lambda: db.fetch_user(user_id))

# Combine with circuit breaker — defense in depth
@circuit_breaker
def fetch_with_retry(url: str):
    return policy.sync(lambda: requests.get(url, timeout=5).json())
\`\`\`

**Why jitter matters:** without jitter, a thousand clients retrying at exactly 1s / 2s / 4s / ... synchronize and crush the recovering service. **Full jitter** (AWS recommendation) smears the retry storm. Also: **budget retries** — don't retry if the error is non-retryable (4xx), and cap total time.`,
        },
        {
          q: "Dependency Injection container — FastAPI style",
          a: `\`\`\`python
from __future__ import annotations
from dataclasses import dataclass
from functools import lru_cache
from typing import Annotated
from fastapi import Depends, FastAPI
from sqlalchemy.orm import Session

# --- Settings (cached, loaded once) ---
@lru_cache
def get_settings() -> Settings:
    return Settings()                      # pydantic-settings from env

# --- Infrastructure (session-scoped) ---
def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_redis():
    return redis_client                    # module-level singleton

# --- Repositories (request-scoped, need db) ---
def get_user_repo(db: Annotated[Session, Depends(get_db)]) -> UserRepository:
    return SqlAlchemyUserRepository(db)

def get_order_repo(db: Annotated[Session, Depends(get_db)]) -> OrderRepository:
    return SqlAlchemyOrderRepository(db)

# --- Use cases (compose repos + other deps) ---
def get_place_order_use_case(
    orders: Annotated[OrderRepository, Depends(get_order_repo)],
    users: Annotated[UserRepository, Depends(get_user_repo)],
    settings: Annotated[Settings, Depends(get_settings)],
) -> PlaceOrder:
    return PlaceOrder(orders=orders, users=users, tax_rate=settings.tax_rate)

# --- Current user (auth middleware result) ---
def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    users: Annotated[UserRepository, Depends(get_user_repo)],
) -> User:
    user = users.get_by_token(token)
    if not user:
        raise HTTPException(401)
    return user

# --- Routes just declare what they need ---
app = FastAPI()

@app.post("/orders")
def create_order(
    req: CreateOrderRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    place_order: Annotated[PlaceOrder, Depends(get_place_order_use_case)],
):
    return place_order(user=current_user, items=req.items)

# --- Tests override dependencies ---
def test_create_order():
    app.dependency_overrides[get_user_repo]  = lambda: InMemoryUserRepository()
    app.dependency_overrides[get_order_repo] = lambda: InMemoryOrderRepository()
    app.dependency_overrides[get_current_user] = lambda: User(id=1, name="Test")
    response = TestClient(app).post("/orders", json={...})
    app.dependency_overrides.clear()
\`\`\`

**Why this wins:** no globals, no mocks, explicit dependency graph, swappable at any layer, test isolation is trivial. Alternatives: \`dependency-injector\`, \`punq\`, \`kink\`.`,
        },
        {
          q: "Feature Flags — ship dark, release gradually",
          a: `\`\`\`python
from __future__ import annotations
from dataclasses import dataclass
from typing import Protocol
import hashlib

class FeatureFlags(Protocol):
    def is_enabled(self, flag: str, user_id: str | None = None) -> bool: ...
    def get_variant(self, flag: str, user_id: str) -> str: ...

@dataclass
class StaticFlags:
    """For tests / bootstrap — reads from dict."""
    flags: dict[str, bool | dict]
    def is_enabled(self, flag, user_id=None): return bool(self.flags.get(flag, False))
    def get_variant(self, flag, user_id): return self.flags.get(flag, {}).get("variant", "control")

class PercentageRolloutFlags:
    """Deterministic rollout: same user always gets same answer."""
    def __init__(self, redis):
        self._redis = redis

    def is_enabled(self, flag: str, user_id: str | None = None) -> bool:
        config = self._load(flag)
        if not config.get("enabled"):
            return False
        if user_id is None:
            return config.get("percentage", 0) >= 100

        # Allowlist beats percentage
        if user_id in config.get("allowlist", set()):
            return True
        if user_id in config.get("blocklist", set()):
            return False

        # Hash user → deterministic bucket in 0-99
        bucket = int(hashlib.md5(f"{flag}:{user_id}".encode()).hexdigest(), 16) % 100
        return bucket < config.get("percentage", 0)

    def _load(self, flag: str) -> dict:
        raw = self._redis.get(f"flag:{flag}")
        return json.loads(raw) if raw else {}

# --- Usage in a handler ---
@app.get("/search")
def search(q: str, flags: Annotated[FeatureFlags, Depends()], user: Annotated[User, Depends()]):
    if flags.is_enabled("new_search_engine", user_id=str(user.id)):
        return new_search.query(q)
    return legacy_search.query(q)

# --- A/B experiment ---
variant = flags.get_variant("checkout_button_color", user_id=str(user.id))
# "control" | "green" | "blue"
metrics.increment("checkout.view", tags={"variant": variant})
\`\`\`

**Production providers:** LaunchDarkly, Unleash, ConfigCat, Flagsmith. **Rules:** flags expire (delete stale code!), log variant on every metric event (attribution), kill-switch flags separate from experiment flags.`,
        },
        {
          q: "Background jobs with exactly-once semantics",
          a: `Celery/RQ give at-least-once. For exactly-once, combine: idempotency + outbox + dedup.

\`\`\`python
from __future__ import annotations
from celery import Celery, Task
from functools import wraps
import hashlib
import logging

log = logging.getLogger(__name__)
app = Celery("myapp", broker="redis://...", backend="redis://...")

class IdempotentTask(Task):
    """Base task with built-in deduplication."""
    autoretry_for = (ConnectionError, TimeoutError)
    retry_backoff = True
    retry_backoff_max = 60
    retry_jitter = True
    max_retries = 5
    acks_late = True
    reject_on_worker_lost = True

def idempotent(*, ttl_seconds: int = 3600):
    """Decorator — skips task if idempotency key already processed."""
    def decorator(fn):
        @wraps(fn)
        def wrapper(self, *args, **kwargs):
            key = kwargs.pop("_idempotency_key", None)
            if key is None:
                # Auto-generate from args (caller should provide explicit key ideally)
                canonical = f"{fn.__name__}:{args}:{sorted(kwargs.items())}"
                key = hashlib.sha256(canonical.encode()).hexdigest()[:16]

            # Try to claim — returns True if first to claim
            claimed = redis.set(f"task:done:{key}", "1", nx=True, ex=ttl_seconds)
            if not claimed:
                log.info("task %s skipped — already processed (key=%s)", fn.__name__, key)
                return {"status": "deduped"}

            try:
                return fn(self, *args, **kwargs)
            except Exception:
                redis.delete(f"task:done:{key}")    # allow retry
                raise
        return wrapper
    return decorator

@app.task(base=IdempotentTask, bind=True)
@idempotent(ttl_seconds=86400)
def send_welcome_email(self, user_id: int):
    user = db.get_user(user_id)
    smtp.send(user.email, "Welcome", render_template(user))
    return {"user_id": user_id, "sent": True}

# Caller provides idempotency key — must be the same for retries of the SAME event
send_welcome_email.apply_async(
    args=[user_id],
    kwargs={"_idempotency_key": f"welcome:{user_id}:{signup_event_id}"},
)
\`\`\`

**Reality check:** truly exactly-once across distributed systems is theoretically impossible (FLP, Two Generals). "Effectively once" = at-least-once + idempotent handlers. Always design handlers to be idempotent.`,
        },
        {
          q: "Observability — structured logs + metrics + traces",
          a: `\`\`\`python
from __future__ import annotations
import logging
import time
from contextlib import contextmanager
from contextvars import ContextVar
from uuid import uuid4

# --- Request-scoped context (flows through async and threads) ---
request_id_ctx: ContextVar[str] = ContextVar("request_id", default="-")
user_id_ctx: ContextVar[str] = ContextVar("user_id", default="-")

# --- Structured logger with context injection ---
class ContextFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        record.request_id = request_id_ctx.get()
        record.user_id = user_id_ctx.get()
        return True

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s level=%(levelname)s logger=%(name)s '
           'request_id=%(request_id)s user_id=%(user_id)s msg=%(message)s',
)
for h in logging.getLogger().handlers:
    h.addFilter(ContextFilter())

log = logging.getLogger(__name__)

# --- Prometheus metrics ---
from prometheus_client import Counter, Histogram, Gauge

http_requests_total = Counter(
    "http_requests_total",
    "HTTP requests",
    ["method", "route", "status"],
)
http_request_duration = Histogram(
    "http_request_duration_seconds",
    "HTTP request latency",
    ["method", "route"],
    buckets=(0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0),
)
in_flight = Gauge("http_requests_in_flight", "Current in-flight requests")

# --- OpenTelemetry tracing ---
from opentelemetry import trace
tracer = trace.get_tracer(__name__)

# --- Middleware that ties it all together ---
@app.middleware("http")
async def observability(request, call_next):
    request_id = request.headers.get("x-request-id", str(uuid4()))
    request_id_ctx.set(request_id)

    route = request.scope.get("route").path if request.scope.get("route") else "unknown"
    method = request.method

    in_flight.inc()
    start = time.monotonic()
    with tracer.start_as_current_span(
        f"{method} {route}",
        attributes={"http.method": method, "http.route": route, "request_id": request_id},
    ) as span:
        try:
            response = await call_next(request)
            status = response.status_code
            span.set_attribute("http.status_code", status)
            return response
        except Exception as e:
            span.record_exception(e)
            span.set_status(trace.StatusCode.ERROR)
            log.exception("unhandled error")
            status = 500
            raise
        finally:
            duration = time.monotonic() - start
            http_requests_total.labels(method, route, str(status)).inc()
            http_request_duration.labels(method, route).observe(duration)
            in_flight.dec()
            response.headers["x-request-id"] = request_id
\`\`\`

**The three pillars:**
- **Logs** — events with structured fields (\`request_id\`, \`user_id\`, \`latency_ms\`) — searchable
- **Metrics** — aggregates over time (rate, latency percentiles, error ratio) — dashboards + alerts
- **Traces** — causality across services (request flows through frontend → API → DB → cache) — debugging latency
- Tie them together via \`request_id\` or trace ID so you can jump from a slow trace → find the logs → see the metric impact`,
        },
        {
          q: "Production Service skeleton — tying it all together",
          a: `Minimum viable structure for a real backend service.

\`\`\`
myservice/
├── pyproject.toml
├── Dockerfile
├── .dockerignore
├── docker-compose.yml            # local dev: postgres, redis, kafka
├── .github/workflows/ci.yml      # lint + test + build + push
├── alembic/                       # migrations
├── src/myservice/
│   ├── __init__.py
│   ├── __main__.py                # python -m myservice  →  uvicorn
│   ├── config.py                  # pydantic-settings
│   ├── logging.py                 # structured logging setup
│   ├── domain/                    # entities, value objects, domain errors
│   ├── application/               # use cases, ports (Protocols)
│   ├── infrastructure/
│   │   ├── db/                    # SQLAlchemy models, repositories
│   │   ├── cache/                 # Redis adapter
│   │   ├── queue/                 # Celery tasks / Kafka producer
│   │   └── http/                  # external API clients
│   ├── interfaces/
│   │   ├── http/                  # FastAPI routers, dependencies
│   │   ├── cli/                   # click/typer commands
│   │   └── workers/               # background workers entry points
│   └── observability/             # metrics, tracing, health
├── tests/
│   ├── unit/                      # pure domain + application
│   ├── integration/               # with testcontainers
│   └── e2e/                       # full HTTP tests
└── scripts/                        # operational one-offs
\`\`\`

\`\`\`python
# src/myservice/__main__.py — composition root
import uvicorn
from myservice.config import Settings
from myservice.logging import setup_logging
from myservice.interfaces.http import create_app

def main():
    settings = Settings()
    setup_logging(settings)
    app = create_app(settings)             # wire all dependencies here
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=settings.port,
        log_config=None,                   # use our logging setup
        access_log=False,                  # we handle it in middleware
    )

if __name__ == "__main__":
    main()
\`\`\`

\`\`\`dockerfile
# Dockerfile — multi-stage, non-root, small
FROM python:3.12-slim AS builder
WORKDIR /app
RUN pip install --no-cache-dir uv
COPY pyproject.toml uv.lock ./
RUN uv pip install --system --no-cache --require-hashes -r <(uv pip compile pyproject.toml)

FROM python:3.12-slim
RUN useradd -r -u 1000 app
COPY --from=builder /usr/local/lib/python3.12 /usr/local/lib/python3.12
COPY --from=builder /usr/local/bin /usr/local/bin
WORKDIR /app
COPY src/ ./src/
ENV PYTHONPATH=/app/src PYTHONUNBUFFERED=1
USER app
EXPOSE 8000
CMD ["python", "-m", "myservice"]
\`\`\`

**Production checklist:**
- Config via env vars (12-factor)
- Non-root container user
- Multi-stage build (small image)
- Structured JSON logs to stdout
- \`/livez\` \`/readyz\` \`/startupz\` endpoints
- Prometheus \`/metrics\`
- OpenTelemetry tracing
- Request ID propagation
- Graceful SIGTERM handling
- CI: lint (ruff), types (mypy), tests (pytest), security (bandit + pip-audit)
- Migrations run as init container, not on app startup`,
        },
        {
          q: "12-factor app checklist (relevant for Python services)",
          a: `1. One codebase, many deploys
2. Explicit dependencies (\`requirements.txt\`, \`pyproject.toml\`)
3. Config in environment variables
4. Treat backing services as attached resources
5. Strict build/release/run separation
6. Stateless processes
7. Port binding (the app exposes its own port)
8. Concurrency via process model
9. Disposability — fast startup, graceful shutdown
10. Dev/prod parity
11. Logs as event streams (stdout)
12. Admin tasks as one-off processes`,
        },
      ],
    },

    // ============ STRINGS & BYTES ============
    {
      cat: "basics",
      icon: <Code2 size={18} />,
      title: "11. Strings, Bytes & Encoding",
      level: "Trainee → Mid",
      items: [
        {
          q: "str vs bytes vs bytearray",
          a: `**str** — immutable sequence of Unicode code points. What you use 99% of the time.
**bytes** — immutable sequence of integers 0-255. Raw binary data, network/file I/O.
**bytearray** — mutable version of bytes. Build up buffers in place.

\`\`\`python
s = "héllo"              # str — 5 characters
b = s.encode("utf-8")    # bytes — b'h\\xc3\\xa9llo' (6 bytes; é is 2 bytes in UTF-8)
len(s), len(b)           # (5, 6)

b.decode("utf-8")        # back to 'héllo'
b.decode("ascii")        # UnicodeDecodeError — é isn't ASCII

ba = bytearray(b)        # mutable
ba[0] = ord("H")
bytes(ba)                # b'H\\xc3\\xa9llo'
\`\`\`

**Rule:** text is \`str\`, network/disk is \`bytes\`. \`encode()\` str→bytes, \`decode()\` bytes→str. Always be explicit about encoding, never rely on defaults.`,
        },
        {
          q: "String methods you should know cold",
          a: `\`\`\`python
s = "  Hello, World!  "

# Stripping
s.strip()                    # 'Hello, World!'
s.lstrip(), s.rstrip()       # one side
s.removeprefix("  H")        # '  Hello, World!' → 'ello, World!'   (3.9+)
s.removesuffix("!  ")        # removes suffix

# Case
s.lower(), s.upper()         # ASCII case
s.casefold()                 # aggressive lowercase for comparison (ß → ss)
s.title(), s.capitalize()
s.swapcase()

# Search / test
s.startswith("  H")          # True
s.endswith(("!  ", "?  "))   # accepts tuple
s.find("World")              # 9 (index) or -1
s.index("World")             # 9 or raises ValueError
s.count("l")                 # 3

# Split / join
"a,b,c".split(",")           # ['a','b','c']
"a,,b".split(",")            # ['a','','b']
"a b\\nc".split()             # ['a','b','c'] — any whitespace, no empties
"line1\\nline2".splitlines() # handles \\r\\n properly
",".join(["a", "b", "c"])    # 'a,b,c'  (MUCH faster than += in a loop)

# Replace / translate
s.replace("l", "L", 2)       # replace first 2 only

# Classification
"abc123".isalnum()           # True
"abc".isalpha()              # True
"123".isdigit()              # True
"   ".isspace()              # True
\`\`\``,
        },
        {
          q: "f-strings — every feature worth knowing",
          a: `\`\`\`python
name, age = "Alice", 30
pi = 3.14159265
n = 1234567

# Basic
f"{name} is {age}"                   # 'Alice is 30'

# Expressions
f"{name.upper()} ({age * 12} months)"

# Debug form (3.8+)
f"{name=}, {age=}"                   # "name='Alice', age=30"

# Width, alignment, fill
f"{name:>10}"                        # '     Alice'  (right, width 10)
f"{name:<10}|"                       # 'Alice     |'
f"{name:^10}"                        # '  Alice   '  (center)
f"{name:*^10}"                       # '**Alice***'  (fill with *)

# Numbers
f"{pi:.2f}"                          # '3.14'
f"{pi:10.4f}"                        # '    3.1416'
f"{n:,}"                             # '1,234,567'  (thousands sep)
f"{n:_}"                             # '1_234_567'
f"{0.25:.1%}"                        # '25.0%'
f"{255:#x}"                          # '0xff'
f"{8:08b}"                           # '00001000' (binary, zero-padded)
f"{1_500_000:.2e}"                   # '1.50e+06'

# Dates
from datetime import datetime
now = datetime(2026, 4, 17, 12, 30)
f"{now:%Y-%m-%d %H:%M}"              # '2026-04-17 12:30'

# Nested
width = 10
f"{name:>{width}}"                   # right-align with dynamic width
\`\`\``,
        },
        {
          q: "String concatenation — when to use what",
          a: `\`\`\`python
# ❌ Anti-pattern: O(n²) because each += copies the whole string
result = ""
for piece in pieces:
    result += piece

# ✅ O(n): join
result = "".join(pieces)

# ✅ O(n) when you need formatting: list + join
parts = []
for i, name in enumerate(names):
    parts.append(f"{i}. {name}")
result = "\\n".join(parts)

# ✅ Alternative: io.StringIO (for many small writes)
from io import StringIO
buf = StringIO()
for chunk in chunks:
    buf.write(chunk)
result = buf.getvalue()

# For templating with many variables, consider string.Template (safer than f-string for user input)
from string import Template
t = Template("Hello, $name!")
t.substitute(name="Alice")           # 'Hello, Alice!'
t.safe_substitute(name="Alice")      # doesn't raise if key missing
\`\`\``,
        },
        {
          q: "Unicode gotchas",
          a: `\`\`\`python
s1 = "café"                          # composed: 4 code points
s2 = "cafe\\u0301"                    # decomposed: 5 code points (e + combining accent)
s1 == s2                             # False! Same visual, different bytes

# Normalize before comparison
import unicodedata
unicodedata.normalize("NFC", s1) == unicodedata.normalize("NFC", s2)   # True

# len() counts code points, not visible characters
len("👨‍👩‍👧")                         # 5 (emoji is a ZWJ sequence)
len("é")                             # 1 or 2 depending on normalization
\`\`\`

**Practical rules:**
- Always specify \`encoding="utf-8"\` when opening text files
- Normalize user input (NFC) before storing or comparing
- For user-visible string length, use a grapheme library like \`grapheme\` or \`regex\`
- Don't index into strings for multi-char logic — iterate`,
        },
        {
          q: "Raw strings, triple quotes, escape sequences",
          a: `\`\`\`python
# Raw string — no escape processing. Essential for regex and Windows paths.
path = r"C:\\Users\\Alice\\file.txt"      # no double-backslashing needed
pattern = r"\\d+\\.\\d+"                  # regex stays readable

# Triple-quoted — multiline
sql = """
SELECT *
FROM users
WHERE active = true
"""

# Combine raw + triple
regex = r"""
    \\d{3}   # area code
    -
    \\d{4}   # number
"""

# Common escapes
"\\n"   # newline
"\\t"   # tab
"\\\\"   # literal backslash
"\\'"   # literal single quote
"\\x41" # 'A' (hex byte)
"\\u00e9" # 'é' (unicode)
"\\N{GREEK SMALL LETTER ALPHA}"  # 'α' (by name)
\`\`\``,
        },
        {
          q: "Regex — essential patterns with re module",
          a: `\`\`\`python
import re

# Compile once, reuse — much faster in loops
EMAIL_RE = re.compile(r"^[\\w.+-]+@[\\w-]+\\.[\\w.-]+$")

EMAIL_RE.match("a@b.com")              # Match object or None
bool(EMAIL_RE.match("a@b.com"))        # True

# Common functions
re.search(pattern, text)               # first match anywhere
re.match(pattern, text)                # only at start
re.fullmatch(pattern, text)            # must match entire string
re.findall(pattern, text)              # list of all matches
re.finditer(pattern, text)             # iterator of Match objects
re.split(pattern, text)                # split on pattern
re.sub(pattern, replacement, text)     # replace

# Groups
m = re.match(r"(\\w+)@(\\w+)\\.(\\w+)", "alice@example.com")
m.group(0)         # whole match: 'alice@example.com'
m.group(1), m.group(2), m.group(3)   # 'alice', 'example', 'com'
m.groups()         # ('alice', 'example', 'com')

# Named groups — way more readable
m = re.match(r"(?P<user>\\w+)@(?P<domain>\\w+)", "alice@example")
m.group("user")    # 'alice'
m.groupdict()      # {'user': 'alice', 'domain': 'example'}

# Flags
re.search(r"hello", text, re.IGNORECASE | re.MULTILINE)

# Non-greedy vs greedy
re.findall(r"<.*>",  "<a><b>")    # ['<a><b>']     — greedy
re.findall(r"<.*?>", "<a><b>")    # ['<a>', '<b>'] — non-greedy
\`\`\`

**Performance tip:** for hot paths, \`re.compile\` the pattern at module level. The \`re\` module caches compiled patterns internally but only up to 512.`,
        },
      ],
    },

    // ============ NUMBERS & MATH ============
    {
      cat: "basics",
      icon: <Code2 size={18} />,
      title: "12. Numbers, Floats & Precision",
      level: "Trainee → Mid",
      items: [
        {
          q: "Integer types — Python has arbitrary precision",
          a: `Unlike C/Java, Python ints have no fixed size — they grow as needed.

\`\`\`python
2 ** 1000                    # works fine, 302-digit number
(10 ** 100) + 1              # googol + 1, exact

# Division
7 / 2                        # 3.5    — true division (always float)
7 // 2                       # 3      — floor division
-7 // 2                      # -4     — floors toward negative infinity (careful!)
7 % 2                        # 1
divmod(7, 2)                 # (3, 1) — quotient and remainder in one call

# Bitwise
0b1010 & 0b1100              # 8   (AND)
0b1010 | 0b1100              # 14  (OR)
0b1010 ^ 0b1100              # 6   (XOR)
~0b1010                      # -11 (NOT — two's complement)
1 << 4                       # 16  (shift left)
32 >> 2                      # 8   (shift right)

# Useful
abs(-5), pow(2, 10), pow(2, 10, 1000)   # pow(b, e, m) = b**e % m, but fast
bin(42)                      # '0b101010'
hex(255)                     # '0xff'
oct(8)                       # '0o10'
int("ff", 16)                # 255
int("0b1010", 0)             # 10 — 0 base auto-detects prefix
\`\`\``,
        },
        {
          q: "Float pitfalls — why 0.1 + 0.2 != 0.3",
          a: `Floats are IEEE 754 binary, and many decimals can't be represented exactly.

\`\`\`python
0.1 + 0.2                    # 0.30000000000000004
0.1 + 0.2 == 0.3             # False

import math
math.isclose(0.1 + 0.2, 0.3)           # True — default tolerances
math.isclose(a, b, rel_tol=1e-9, abs_tol=0.0)   # tunable

# For money: use Decimal (exact) or int cents (fast + exact)
from decimal import Decimal, getcontext
getcontext().prec = 28
Decimal("0.1") + Decimal("0.2")        # Decimal('0.3') — exact
Decimal("0.1") + Decimal("0.2") == Decimal("0.3")   # True

# For scientific/stats: Fraction for rationals
from fractions import Fraction
Fraction(1, 3) + Fraction(1, 6)        # Fraction(1, 2) — exact

# Useful math
math.inf, -math.inf, math.nan
math.isnan(float("nan"))               # True
math.isfinite(x)
math.floor(1.7), math.ceil(1.2), math.trunc(-1.7)
round(2.5), round(3.5)                 # 2, 4 — banker's rounding!
round(2.675, 2)                        # 2.67  (not 2.68 — floating-point)
\`\`\`

**Rules:**
- NEVER use float for money. Use \`Decimal\` or integer cents.
- NEVER compare floats with \`==\`. Use \`math.isclose\`.
- \`round()\` uses banker's rounding (round-half-to-even). For normal rounding, use \`Decimal\` with \`ROUND_HALF_UP\`.`,
        },
        {
          q: "Random vs secrets — use the right one",
          a: `\`\`\`python
# 'random' — NOT cryptographically secure. Use for games, simulations, shuffling.
import random
random.random()              # [0.0, 1.0)
random.randint(1, 10)        # inclusive both ends
random.randrange(10)         # [0, 10), like range()
random.choice(["a", "b"])
random.choices(pop, weights=[1, 2, 3], k=10)   # with replacement
random.sample(pop, k=5)      # without replacement
random.shuffle(lst)          # in place
random.seed(42)              # reproducibility

# 'secrets' — cryptographically secure. Use for tokens, passwords, keys.
import secrets
secrets.token_hex(16)        # 32-char hex string
secrets.token_urlsafe(32)    # URL-safe base64
secrets.randbelow(10**9)     # secure random int
secrets.compare_digest(a, b) # constant-time compare (timing attack safe)
\`\`\`

**Rule:** anything security-sensitive (session tokens, reset links, API keys, passwords) → \`secrets\`. Anything else → \`random\`.`,
        },
      ],
    },

    // ============ FUNCTIONS DEEP DIVE ============
    {
      cat: "basics",
      icon: <Code2 size={18} />,
      title: "13. Functions Deep Dive",
      level: "Mid → Senior",
      items: [
        {
          q: "Argument types — positional, keyword, *args, **kwargs",
          a: `\`\`\`python
def f(a, b, /, c, d, *args, e, f=10, **kwargs):
    #   ^     ^             ^
    #   |     |             └── keyword-only (after *)
    #   |     └── can be positional OR keyword
    #   └── positional-only (before /)
    pass

# Positional-only (3.8+) — 'a' and 'b' MUST be positional
# Keyword-only — 'e' and 'f' MUST be keyword

def greet(name, *, greeting="Hello"):   # greeting is keyword-only
    return f"{greeting}, {name}!"

greet("Alice")                       # ok
greet("Alice", greeting="Hi")        # ok
greet("Alice", "Hi")                 # TypeError — can't pass positionally

# Unpacking at call site
args = (1, 2, 3)
kwargs = {"x": 10, "y": 20}
func(*args, **kwargs)                # equivalent to func(1, 2, 3, x=10, y=20)
\`\`\``,
        },
        {
          q: "Closures and the free variable problem",
          a: `A closure is a function that captures variables from an enclosing scope.

\`\`\`python
def make_counter():
    count = 0
    def counter():
        nonlocal count               # required to MUTATE outer variable
        count += 1
        return count
    return counter

c = make_counter()
c(); c(); c()                        # 1, 2, 3

# Without 'nonlocal' — UnboundLocalError because assignment creates a local
def broken():
    count = 0
    def inner():
        count += 1                   # error! 'count' is local here
        return count
    return inner
\`\`\`

**Rules:**
- Reading outer variable → works automatically
- Assigning to outer variable → need \`nonlocal\` (inner function) or \`global\` (module level)
- Closures over loop variables bind by REFERENCE, not value (late binding — see Tricky Qs section)`,
        },
        {
          q: "Lambda — when to use (and when not to)",
          a: `\`\`\`python
# Good use: short, one-off, no name needed
sorted(users, key=lambda u: u.age)
sorted(items, key=lambda x: (x.priority, -x.created_at))
list(filter(lambda x: x > 0, nums))

# Good use: partial application alternative
add5 = lambda x: x + 5               # fine, but prefer functools.partial or def

# Bad — assign lambda to a name (PEP 8 says use def)
square = lambda x: x * x             # ❌ — use def square(x): return x * x

# Bad — multi-statement logic (lambdas can't have statements)
# Bad — anything complex: readability wins
\`\`\`

**When to reach for lambda:** key functions for \`sorted/min/max\`, \`filter/map\` arguments, quick callbacks. Anything else: use \`def\`.`,
        },
        {
          q: "functools essentials",
          a: `\`\`\`python
from functools import (
    partial, reduce, lru_cache, cache, cached_property,
    wraps, total_ordering, singledispatch,
)

# partial — freeze some arguments
from functools import partial
int_hex = partial(int, base=16)
int_hex("ff")                        # 255
log_warn = partial(log.log, logging.WARNING)

# reduce — fold left over an iterable
from functools import reduce
reduce(lambda acc, x: acc + x, [1, 2, 3, 4], 0)   # 10 (sum)
# ... but use sum() / math.prod() when they fit.

# lru_cache / cache — memoization
@lru_cache(maxsize=128)
def fib(n):
    return n if n < 2 else fib(n-1) + fib(n-2)

fib.cache_info()     # CacheInfo(hits=..., misses=..., maxsize=128, currsize=...)
fib.cache_clear()

@cache              # 3.9+ — unbounded lru_cache
def load_config(): ...

# cached_property — compute once per instance
class Article:
    def __init__(self, body: str): self.body = body
    @cached_property
    def word_count(self) -> int:
        return len(self.body.split())   # computed on first access, cached

# total_ordering — define __eq__ + one of <,<=,>,>= → get all comparisons
@total_ordering
class Version:
    def __init__(self, tup): self.tup = tup
    def __eq__(self, o): return self.tup == o.tup
    def __lt__(self, o): return self.tup <  o.tup
# Now >, >=, <= all work

# singledispatch — function overloading by first arg type
@singledispatch
def render(value) -> str:
    return str(value)

@render.register
def _(value: list) -> str:
    return "[" + ", ".join(render(v) for v in value) + "]"

@render.register
def _(value: dict) -> str:
    return "{" + ", ".join(f"{k}: {render(v)}" for k, v in value.items()) + "}"
\`\`\``,
        },
        {
          q: "itertools — the power tools",
          a: `\`\`\`python
import itertools as it

# Infinite iterators — always combine with islice or break
it.count(10, 2)              # 10, 12, 14, ...
it.cycle([1, 2, 3])          # 1, 2, 3, 1, 2, 3, ...
it.repeat("x", 3)            # x, x, x

# Chaining & slicing
list(it.chain([1, 2], [3, 4]))            # [1,2,3,4]
list(it.chain.from_iterable([[1,2],[3]])) # [1,2,3] — flatten one level
list(it.islice(it.count(), 0, 10, 2))     # [0,2,4,6,8]

# Grouping
for key, group in it.groupby(sorted(items, key=lambda x: x.type),
                             key=lambda x: x.type):
    print(key, list(group))
# ⚠ groupby only groups CONSECUTIVE items — sort first!

# Combinatorics
list(it.product([1,2], ["a","b"]))        # [(1,'a'),(1,'b'),(2,'a'),(2,'b')]
list(it.permutations([1,2,3], 2))         # [(1,2),(1,3),(2,1),(2,3),(3,1),(3,2)]
list(it.combinations([1,2,3], 2))         # [(1,2),(1,3),(2,3)]
list(it.combinations_with_replacement([1,2], 2))   # [(1,1),(1,2),(2,2)]

# Windowing (3.12+)
list(it.batched([1,2,3,4,5], 2))          # [(1,2),(3,4),(5,)]

# Pairing
list(it.pairwise([1,2,3,4]))              # [(1,2),(2,3),(3,4)]
list(it.zip_longest([1,2],[3,4,5], fillvalue=0))   # [(1,3),(2,4),(0,5)]

# Take while / drop while
list(it.takewhile(lambda x: x < 5, [1,3,5,2]))     # [1,3]
list(it.dropwhile(lambda x: x < 5, [1,3,5,2]))     # [5,2]

# Accumulate (running totals)
list(it.accumulate([1,2,3,4]))            # [1,3,6,10]
list(it.accumulate([1,2,3,4], max))       # [1,2,3,4]
\`\`\``,
        },
        {
          q: "Recursion in Python — limits and tricks",
          a: `\`\`\`python
import sys
sys.getrecursionlimit()               # 1000 by default
sys.setrecursionlimit(10_000)         # bump if needed (be careful — stack overflow)

# Naive recursion — will blow the stack for large n
def fact(n):
    return 1 if n <= 1 else n * fact(n - 1)

# Tail-call? Python DOESN'T optimize tail calls. Rewrite iteratively.
def fact_iter(n):
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result

# Memoize to avoid recomputation
from functools import lru_cache
@lru_cache(maxsize=None)
def fib(n):
    return n if n < 2 else fib(n-1) + fib(n-2)

# Trampoline / iterative deepening for deep recursion
# Generally: if recursion is >500 deep, refactor to iteration + explicit stack.
\`\`\`

**Rule:** for depths over a few hundred, convert to iteration. Python's lack of TCO means even correct tail-recursive code fails.`,
        },
      ],
    },

    // ============ MODULES & PACKAGING ============
    {
      cat: "basics",
      icon: <Package size={18} />,
      title: "14. Modules, Imports & Packaging",
      level: "Mid → Senior",
      items: [
        {
          q: "How import actually works",
          a: `When Python sees \`import foo\`, roughly:
1. Check \`sys.modules\` cache — if present, use it
2. Otherwise, use **finders** in \`sys.meta_path\` to locate the module
3. Use a **loader** to execute the code and create a module object
4. Bind the name in the current namespace
5. Cache in \`sys.modules\`

\`\`\`python
import sys
sys.path              # list of directories searched
sys.modules           # dict of already-loaded modules
sys.modules["os"]     # the os module object

# Reload (dev only — be careful)
import importlib
import mymodule
importlib.reload(mymodule)

# Dynamic import by name
mod = importlib.import_module("package.submodule")
\`\`\`

**Key implication:** a module is only imported ONCE per process. Top-level code in the module runs exactly once. That's why singletons-as-modules work.`,
        },
        {
          q: "Absolute vs relative imports",
          a: `\`\`\`python
# --- Absolute (preferred) — full path from a top-level package ---
from myapp.services.email import send

# --- Relative — path relative to current module's package ---
# Inside myapp/services/email.py:
from .templates import WELCOME         # same package
from ..config import settings          # parent package
from ...shared import logger           # grandparent

# Relative imports only work INSIDE a package (with __init__.py or namespace pkg)
# and only in modules, not in scripts run with python file.py
\`\`\`

**PEP 8:** prefer absolute imports. Use relative only within a package when it improves clarity.`,
        },
        {
          q: "if __name__ == '__main__' — why it exists",
          a: `Every module has \`__name__\`. When run directly → \`"__main__"\`. When imported → the module's name.

\`\`\`python
# mymodule.py
def main():
    print("running!")

def helper():
    return 42

if __name__ == "__main__":
    main()          # only runs when executed directly, not on import
\`\`\`

**Why it matters:**
- Lets a file serve as both importable library AND script
- \`multiprocessing\` on Windows/macOS spawn requires it — without it, child processes re-run the whole module and fork bombs you
- Makes testing easier — you can import the module without side effects

**Modern convention** for CLI entry points: put \`main()\` in the module, and register it in \`pyproject.toml\`:
\`\`\`toml
[project.scripts]
mytool = "myapp.cli:main"
\`\`\``,
        },
        {
          q: "Package structure — modern layout",
          a: `\`\`\`
myproject/
├── pyproject.toml           # build + deps + tool config (PEP 621)
├── README.md
├── LICENSE
├── src/
│   └── myapp/               # the actual package
│       ├── __init__.py      # makes it a package; exports public API
│       ├── __main__.py      # enables python -m myapp
│       ├── cli.py
│       ├── config.py
│       └── services/
│           ├── __init__.py
│           └── email.py
└── tests/
    ├── __init__.py
    └── test_email.py
\`\`\`

**src/ layout** is now the standard — forces you to install the package to test it, which catches "works on my machine because of CWD" bugs.

**pyproject.toml** skeleton:
\`\`\`toml
[project]
name = "myapp"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = [
    "httpx>=0.27",
    "pydantic>=2",
]

[project.optional-dependencies]
dev = ["pytest", "mypy", "ruff"]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.ruff]
line-length = 100

[tool.mypy]
strict = true
\`\`\``,
        },
        {
          q: "Virtual environments and dependency management",
          a: `\`\`\`bash
# --- venv (stdlib) — always works, no extra deps ---
python -m venv .venv
source .venv/bin/activate     # Linux/macOS
.venv\\Scripts\\activate        # Windows
pip install -e ".[dev]"       # editable install of current project + dev extras

# --- Modern tools ---
# uv (fast, Rust-based, recommended in 2026)
uv venv
uv pip install -e ".[dev]"
uv pip compile pyproject.toml -o requirements.txt

# poetry
poetry install
poetry add httpx

# pdm
pdm install
pdm add httpx
\`\`\`

**Key principles:**
- **Always** use a virtual environment per project
- **Pin** production deps (\`requirements.txt\` with exact versions or \`uv.lock\`/\`poetry.lock\`)
- Don't commit \`.venv/\` — add to \`.gitignore\`
- Use \`pip install -e .\` (editable) during development so changes are live`,
        },
        {
          q: "Circular imports — how to fix them",
          a: `\`\`\`python
# a.py
from .b import thing_b
def thing_a(): return thing_b()

# b.py
from .a import thing_a
def thing_b(): return thing_a()       # ImportError or AttributeError
\`\`\`

**Fixes (in order of preference):**

**1. Refactor** — extract shared code to a third module.
\`\`\`python
# shared.py  — both a and b import from here
def core(): ...
\`\`\`

**2. Import inside the function** — defer resolution.
\`\`\`python
# a.py
def thing_a():
    from .b import thing_b
    return thing_b()
\`\`\`

**3. TYPE_CHECKING** — for type hints only.
\`\`\`python
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from .b import ThingB           # only seen by mypy, not at runtime

def process(x: "ThingB") -> None: ...   # quote the name
\`\`\`

**4. Top-level import, but attribute access** — if you just need the module.
\`\`\`python
from . import b
def thing_a(): return b.thing_b()
\`\`\``,
        },
        {
          q: "__init__.py — what belongs there",
          a: `\`\`\`python
# myapp/__init__.py

# 1. Version
__version__ = "1.2.3"

# 2. Public API — explicit re-exports
from myapp.services.email import send_email
from myapp.services.users import User, register_user

# 3. Explicit __all__ — what 'from myapp import *' gives you
__all__ = ["send_email", "User", "register_user", "__version__"]

# 4. Package-level setup (rare — do sparingly)
import logging
logging.getLogger(__name__).addHandler(logging.NullHandler())
\`\`\`

**Don't:**
- Put heavy imports here — they slow down every \`import myapp.anything\`
- Run side-effectful code (network calls, DB connects, file writes)
- Define your actual code here — use submodules and re-export`,
        },
      ],
    },

    // ============ TYPING ============
    {
      cat: "advanced",
      icon: <Shield size={18} />,
      title: "15. Type Hints — Modern Python",
      level: "Mid → Senior",
      items: [
        {
          q: "Why type hints? (the interview answer)",
          a: `**They are:**
- Machine-checkable documentation
- Caught-at-edit-time bug prevention (mypy, pyright)
- IDE autocomplete & refactoring
- Runtime tools for serialization (Pydantic, dataclasses, attrs)

**They are NOT:**
- Enforced by Python at runtime (by default)
- A substitute for tests
- A performance optimization (Python ignores them)

Any project larger than a script should have typing. Use \`mypy --strict\` or \`pyright\` in CI.`,
        },
        {
          q: "Basic type hints",
          a: `\`\`\`python
from __future__ import annotations   # enables modern syntax in older Pythons
from typing import Optional, Union, Any, Literal, Final, TypeAlias

# Builtins (3.9+)
x: int = 5
names: list[str] = []
scores: dict[str, int] = {}
coords: tuple[float, float] = (1.0, 2.0)
unique: set[int] = set()

# Optional — means "X or None"
user: Optional[User] = None
# equivalent to:
user: User | None = None              # modern syntax (3.10+)

# Union — one of several types
value: int | str = "hello"

# Any — escape hatch, disables checking. Avoid.
payload: Any = ...

# Literal — exact string/int values only
status: Literal["active", "paused", "deleted"] = "active"

# Final — cannot be reassigned
MAX_RETRIES: Final[int] = 3

# Type alias — give a name to a complex type
UserId: TypeAlias = int
Json: TypeAlias = dict[str, "Json"] | list["Json"] | str | int | float | bool | None
\`\`\``,
        },
        {
          q: "Callable, generics, TypeVar",
          a: `\`\`\`python
from typing import Callable, TypeVar, Generic, Iterable, Iterator

# Callable[[arg_types], return_type]
def apply(fn: Callable[[int, int], int], a: int, b: int) -> int:
    return fn(a, b)

# Iterables / iterators
def squares(nums: Iterable[int]) -> Iterator[int]:
    return (n * n for n in nums)

# TypeVar — generic function
T = TypeVar("T")
def first(items: list[T]) -> T:
    return items[0]

first([1, 2, 3])         # T=int, returns int
first(["a", "b"])        # T=str, returns str

# Bounded TypeVar
from numbers import Number
N = TypeVar("N", bound=Number)
def add(a: N, b: N) -> N: return a + b

# Generic class
class Stack(Generic[T]):
    def __init__(self) -> None:
        self._items: list[T] = []
    def push(self, item: T) -> None:
        self._items.append(item)
    def pop(self) -> T:
        return self._items.pop()

s: Stack[int] = Stack()
\`\`\``,
        },
        {
          q: "Protocol — structural (duck) typing",
          a: `Protocols let you type "anything with these methods" without requiring inheritance.

\`\`\`python
from typing import Protocol, runtime_checkable

class SupportsClose(Protocol):
    def close(self) -> None: ...

def safely_close(resource: SupportsClose) -> None:
    resource.close()

# Any class with close() works — no base class needed
safely_close(open("f.txt"))            # file has close()
safely_close(MyConnection())           # if MyConnection has close()

# @runtime_checkable to use with isinstance (slower, less strict)
@runtime_checkable
class Drawable(Protocol):
    def draw(self) -> None: ...

isinstance(obj, Drawable)              # checks method presence (not signatures)
\`\`\`

**Protocol** is the typed version of duck typing — contrast with \`ABC\` which requires explicit inheritance.`,
        },
        {
          q: "TypedDict — typed dictionaries",
          a: `\`\`\`python
from typing import TypedDict, NotRequired, Required

class UserDict(TypedDict):
    id: int
    name: str
    email: NotRequired[str]              # optional key

def process(user: UserDict) -> None:
    print(user["id"])
    if "email" in user:
        send(user["email"])

u: UserDict = {"id": 1, "name": "Alice"}           # OK
u: UserDict = {"id": 1, "name": "Alice", "x": 1}   # mypy error — unknown key
\`\`\`

**When to use:** typing existing dict-shaped data (JSON responses, config). **When NOT to use:** if you control the construction, prefer \`dataclass\` or \`pydantic.BaseModel\` — real classes are clearer.`,
        },
        {
          q: "Overload — multiple signatures",
          a: `\`\`\`python
from typing import overload

@overload
def double(x: int) -> int: ...
@overload
def double(x: str) -> str: ...
@overload
def double(x: list[int]) -> list[int]: ...

def double(x):                           # actual implementation
    if isinstance(x, list):
        return [i * 2 for i in x]
    return x * 2

reveal_type(double(3))      # int
reveal_type(double("hi"))   # str
reveal_type(double([1,2]))  # list[int]
\`\`\`

Only the \`@overload\` stubs define the types seen by mypy; the final (unannotated) definition is the runtime implementation.`,
        },
        {
          q: "Runtime validation — Pydantic, attrs, dataclasses",
          a: `Type hints aren't enforced at runtime. For actual validation, use:

\`\`\`python
# Pydantic — most popular, rich validation
from pydantic import BaseModel, Field, EmailStr
class User(BaseModel):
    id: int = Field(gt=0)
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr

# attrs — faster, more flexible
import attrs
@attrs.define
class User:
    id: int = attrs.field(validator=attrs.validators.gt(0))
    name: str

# dataclasses — stdlib, no validation, just structure
from dataclasses import dataclass
@dataclass
class User:
    id: int; name: str; email: str
\`\`\`

**Decision:**
- **Pydantic** → HTTP/JSON boundary, config, anything untrusted
- **attrs** → internal objects with custom validation
- **dataclass** → pure internal data, no validation needed`,
        },
      ],
    },

    // ============ STANDARD LIBRARY ============
    {
      cat: "stdlib",
      icon: <Database size={18} />,
      title: "16. Standard Library Essentials",
      level: "Mid → Senior",
      items: [
        {
          q: "collections — deque, Counter, defaultdict, namedtuple, OrderedDict, ChainMap",
          a: `\`\`\`python
from collections import deque, Counter, defaultdict, namedtuple, OrderedDict, ChainMap

# deque — O(1) ops at both ends. Use for queues and sliding windows.
dq = deque([1, 2, 3], maxlen=5)       # maxlen → older items drop off
dq.appendleft(0); dq.append(4)        # O(1) both ends
dq.rotate(2)                           # shift right by 2
dq.popleft()                           # O(1) vs list.pop(0) which is O(n)

# Counter — frequency counts
c = Counter("mississippi")             # Counter({'i': 4, 's': 4, 'p': 2, 'm': 1})
c.most_common(2)                       # [('i', 4), ('s', 4)]
c1 - c2                                # subtract (keeps positive)
c1 + c2                                # add
c1 & c2                                # intersection (min)
c1 | c2                                # union (max)

# defaultdict — auto-create missing keys
groups = defaultdict(list)
for name, team in pairs:
    groups[team].append(name)          # no KeyError, auto-creates []
# Also: defaultdict(int), defaultdict(set), defaultdict(lambda: ...)

# namedtuple — lightweight immutable record (prefer dataclass for new code)
Point = namedtuple("Point", ["x", "y"])
p = Point(1, 2); p.x; p[0]             # works like tuple AND has named attrs

# OrderedDict — still useful for move_to_end
d = OrderedDict()
d["a"] = 1; d["b"] = 2
d.move_to_end("a")                     # now {'b': 2, 'a': 1}

# ChainMap — stack of dicts (layered config)
defaults = {"debug": False, "timeout": 10}
overrides = {"debug": True}
config = ChainMap(overrides, defaults)
config["debug"]                        # True (from overrides)
config["timeout"]                      # 10  (falls through to defaults)
\`\`\``,
        },
        {
          q: "datetime, timedelta, zoneinfo",
          a: `\`\`\`python
from datetime import datetime, date, time, timedelta, timezone
from zoneinfo import ZoneInfo          # 3.9+ — stdlib timezone support

# Naive vs aware — ALWAYS use aware datetimes in production
naive = datetime.now()                 # ❌ no tz info, ambiguous
utc   = datetime.now(timezone.utc)     # ✅ unambiguous
ny    = datetime.now(ZoneInfo("America/New_York"))

# Parsing
datetime.fromisoformat("2026-04-17T12:30:00+00:00")    # 3.11+ accepts 'Z'
datetime.strptime("2026-04-17", "%Y-%m-%d")

# Formatting
utc.isoformat()                        # '2026-04-17T12:30:00+00:00'
utc.strftime("%Y-%m-%d %H:%M")

# Arithmetic
now = datetime.now(timezone.utc)
now + timedelta(days=1, hours=3)
(now - past).total_seconds()

# Convert between timezones
utc.astimezone(ZoneInfo("Europe/Paris"))

# Unix timestamps
utc.timestamp()                        # float seconds since epoch
datetime.fromtimestamp(1_700_000_000, tz=timezone.utc)
\`\`\`

**Rules:**
- Store times as UTC, convert on display
- Always attach timezones — naive datetimes are a landmine
- Use \`zoneinfo\` (stdlib) over \`pytz\` in modern Python`,
        },
        {
          q: "pathlib — modern path handling",
          a: `\`\`\`python
from pathlib import Path

p = Path("/var/log/app") / "errors.log"    # /  operator builds paths
p.parent                                   # Path('/var/log/app')
p.name                                     # 'errors.log'
p.stem                                     # 'errors'
p.suffix                                   # '.log'
p.with_suffix(".bak")                      # /var/log/app/errors.bak
p.with_name("audit.log")
p.absolute()
p.resolve()                                # resolve symlinks, normalize

# Existence & type
p.exists(); p.is_file(); p.is_dir(); p.is_symlink()

# Iteration
for path in Path(".").iterdir(): ...       # immediate children
for path in Path(".").rglob("*.py"): ...   # recursive glob
for path in Path(".").glob("**/test_*.py"):

# Read / write
text = p.read_text(encoding="utf-8")
p.write_text("hello", encoding="utf-8")
data = p.read_bytes()
p.write_bytes(b"...")

# Create / delete
p.parent.mkdir(parents=True, exist_ok=True)
p.touch(exist_ok=True)
p.unlink(missing_ok=True)                  # delete file
p.rmdir()                                  # delete empty dir
import shutil; shutil.rmtree(p)            # recursive
\`\`\`

Prefer \`pathlib\` over \`os.path\` — it's more readable, type-safe, and cross-platform.`,
        },
        {
          q: "json, csv, pickle — serialization",
          a: `\`\`\`python
import json

# Basics
json.dumps(obj)                        # → str
json.loads(s)                          # str → obj
json.dump(obj, file)                   # write to file
json.load(file)                        # read from file

# Options
json.dumps(obj, indent=2, sort_keys=True, ensure_ascii=False)
json.dumps(obj, default=str)           # fallback for non-serializable

# Custom encoder for datetime etc.
from datetime import datetime
class DateEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, datetime):
            return o.isoformat()
        return super().default(o)
json.dumps(data, cls=DateEncoder)

# --- CSV ---
import csv
with open("data.csv", encoding="utf-8", newline="") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row["name"], row["age"])

with open("out.csv", "w", encoding="utf-8", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["name", "age"])
    writer.writeheader()
    writer.writerows(rows)

# --- pickle ---
# ⚠ NEVER unpickle untrusted data — executes arbitrary code!
import pickle
data = pickle.dumps(obj)
obj = pickle.loads(data)
\`\`\`

For production APIs, prefer \`orjson\` (10-50x faster) or \`msgspec\` over stdlib \`json\` on hot paths.`,
        },
        {
          q: "logging — configure it once, properly",
          a: `\`\`\`python
import logging
import logging.config

# --- dictConfig (recommended) ---
logging.config.dictConfig({
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "json": {
            "()": "pythonjsonlogger.jsonlogger.JsonFormatter",
            "format": "%(asctime)s %(levelname)s %(name)s %(message)s",
        },
        "console": {
            "format": "%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "console",
            "level": "INFO",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "INFO",
    },
    "loggers": {
        "myapp": {"level": "DEBUG"},         # app-specific
        "urllib3": {"level": "WARNING"},     # quiet noisy libs
    },
})

# --- In each module ---
log = logging.getLogger(__name__)
log.info("user %s logged in", user_id)       # lazy formatting — DO THIS
log.error("failed: %s", err)                  # not: f"failed: {err}" (evaluated always)
log.exception("unexpected")                   # inside except — includes traceback

# --- Structured logging ---
log.info("order placed", extra={"order_id": "o-1", "total": 9.99, "user_id": 42})
\`\`\`

**Rules:**
- Never use \`print\` in production code — use logging
- Use \`%s\` placeholders, not f-strings — lazy evaluation (skipped if level disabled)
- Configure once, at startup, in a single place
- In production: JSON logs + structured fields → searchable in Datadog/Splunk/ELK`,
        },
        {
          q: "argparse / click — CLI apps",
          a: `\`\`\`python
# --- argparse (stdlib) ---
import argparse

def main() -> None:
    p = argparse.ArgumentParser(description="Process files")
    p.add_argument("path", help="Input file")
    p.add_argument("-o", "--output", default="out.txt")
    p.add_argument("-v", "--verbose", action="store_true")
    p.add_argument("--retries", type=int, default=3, choices=range(1, 11))
    args = p.parse_args()

    if args.verbose:
        print(f"processing {args.path} → {args.output}")

# --- click (3rd party, nicer API) ---
import click

@click.command()
@click.argument("path", type=click.Path(exists=True))
@click.option("-o", "--output", default="out.txt")
@click.option("-v", "--verbose", is_flag=True)
@click.option("--retries", type=click.IntRange(1, 10), default=3)
def main(path: str, output: str, verbose: bool, retries: int) -> None:
    if verbose:
        click.echo(f"processing {path}")

# --- typer (type-hint based) ---
import typer
app = typer.Typer()

@app.command()
def process(path: str, output: str = "out.txt", verbose: bool = False):
    ...

if __name__ == "__main__":
    typer.run(process)
\`\`\``,
        },
        {
          q: "subprocess — running external commands",
          a: `\`\`\`python
import subprocess

# --- Modern way: subprocess.run ---
result = subprocess.run(
    ["git", "log", "--oneline", "-n", "5"],
    capture_output=True,                # capture stdout/stderr
    text=True,                           # decode to str, not bytes
    check=True,                          # raise CalledProcessError on non-zero exit
    timeout=30,                          # kill after 30s
    cwd="/path/to/repo",
    env={"GIT_PAGER": ""},
)
print(result.stdout)
print(result.returncode)

# --- With input piped ---
r = subprocess.run(["wc", "-w"], input="hello world", text=True, capture_output=True)

# --- Streaming output (long-running processes) ---
with subprocess.Popen(
    ["tail", "-f", "/var/log/app.log"],
    stdout=subprocess.PIPE, text=True,
) as proc:
    for line in proc.stdout:
        print(line, end="")
\`\`\`

**Security:** never pass user input via \`shell=True\`. Pass a list of args. If you must use a shell, use \`shlex.quote\`.`,
        },
      ],
    },

    // ============ FILE I/O ============
    {
      cat: "stdlib",
      icon: <Database size={18} />,
      title: "17. File I/O Done Right",
      level: "Mid",
      items: [
        {
          q: "Opening files — always with `with`",
          a: `\`\`\`python
# --- Text mode (default) ---
with open("data.txt", "r", encoding="utf-8") as f:
    content = f.read()                 # whole file as str
    # or iterate line by line (memory-efficient)
    for line in f:
        process(line.rstrip("\\n"))

# --- Binary mode ---
with open("image.bin", "rb") as f:
    data = f.read()

# --- Modes ---
# "r"  read (default)
# "w"  write (truncates!)
# "a"  append
# "x"  exclusive create (fails if exists)
# "b"  binary (combine: "rb", "wb")
# "+"  read+write (combine: "r+", "w+")

# --- Atomic writes — don't corrupt on crash ---
import os
tmp = "out.txt.tmp"
with open(tmp, "w", encoding="utf-8") as f:
    f.write(data)
    f.flush()
    os.fsync(f.fileno())               # force to disk
os.replace(tmp, "out.txt")             # atomic rename
\`\`\`

**Rules:**
- Always specify \`encoding\`. Default varies by OS → bugs.
- For large files, iterate line by line (lazy) — don't \`.read()\` into memory.
- Atomic write pattern (write temp + rename) prevents half-written files on crash.`,
        },
        {
          q: "Reading huge files without loading them into memory",
          a: `\`\`\`python
from pathlib import Path

# Line by line — lazy
with open("huge.log", encoding="utf-8") as f:
    for line in f:                     # generator, O(1) memory
        if "ERROR" in line:
            process(line)

# Fixed-size chunks — for binary
def chunks(path, size=64 * 1024):
    with open(path, "rb") as f:
        while chunk := f.read(size):   # walrus
            yield chunk

for chunk in chunks("big.bin"):
    hasher.update(chunk)

# CSV for large files
import csv
with open("big.csv", encoding="utf-8", newline="") as f:
    for row in csv.DictReader(f):      # streams
        process(row)

# JSON streaming (stdlib json loads everything — use ijson for streaming)
import ijson
with open("big.json", "rb") as f:
    for item in ijson.items(f, "item"):
        process(item)
\`\`\``,
        },
        {
          q: "tempfile — safe temporary files",
          a: `\`\`\`python
import tempfile
from pathlib import Path

# Auto-deleted temp file
with tempfile.NamedTemporaryFile(mode="w+", suffix=".json", delete=True) as tf:
    tf.write('{"x": 1}')
    tf.seek(0)
    print(tf.read())
# file gone here

# Auto-deleted temp directory
with tempfile.TemporaryDirectory() as tmpdir:
    path = Path(tmpdir) / "workfile.txt"
    path.write_text("hello")
# dir + contents gone here

# Secure temp path (won't clash)
fd, path = tempfile.mkstemp(suffix=".txt")
os.close(fd)
\`\`\`

Never use \`/tmp/myfile\` — predictable names are a security risk (symlink attacks).`,
        },
      ],
    },

    // ============ TESTING ============
    {
      cat: "testing",
      icon: <Target size={18} />,
      title: "18. Testing with pytest",
      level: "Mid → Senior",
      items: [
        {
          q: "pytest basics",
          a: `\`\`\`python
# test_basic.py
import pytest

def add(a, b): return a + b

def test_add_positive():
    assert add(2, 3) == 5

def test_add_negative():
    assert add(-1, 1) == 0

def test_division_by_zero():
    with pytest.raises(ZeroDivisionError):
        1 / 0

def test_error_message():
    with pytest.raises(ValueError, match=r"must be positive"):
        func(-1)

# Approximate comparison for floats
def test_float():
    assert add(0.1, 0.2) == pytest.approx(0.3)
\`\`\`

Run with \`pytest\`. Common flags: \`-v\` verbose, \`-x\` stop on first fail, \`-k expr\` filter by name, \`--lf\` run last-failed, \`-p no:cacheprovider\` in CI.`,
        },
        {
          q: "Fixtures — dependency injection for tests",
          a: `\`\`\`python
import pytest
from myapp.users import UserRepository

# --- Basic fixture ---
@pytest.fixture
def user_repo():
    return InMemoryUserRepository()

def test_register(user_repo):                 # fixture injected by name
    register_user(user_repo, "a@b.com", "Alice")
    assert user_repo.get_by_email("a@b.com") is not None

# --- Setup + teardown with yield ---
@pytest.fixture
def db_connection():
    conn = connect("postgres://test")
    yield conn                                 # test runs here
    conn.close()                               # cleanup

# --- Scope: function (default), class, module, session ---
@pytest.fixture(scope="session")
def expensive_resource():
    resource = load_big_model()
    yield resource
    resource.cleanup()

# --- Parametrized fixture ---
@pytest.fixture(params=["sqlite", "postgres"])
def db(request):
    return make_db(request.param)

def test_runs_twice(db):                       # once per param
    ...

# --- conftest.py ---
# Put shared fixtures here — auto-discovered by pytest, no import needed
\`\`\``,
        },
        {
          q: "Parametrize — run one test with many inputs",
          a: `\`\`\`python
import pytest

@pytest.mark.parametrize("a,b,expected", [
    (2, 3, 5),
    (0, 0, 0),
    (-1, 1, 0),
    (100, 200, 300),
])
def test_add(a, b, expected):
    assert add(a, b) == expected

# ids for readable output
@pytest.mark.parametrize("email,valid", [
    ("a@b.com",  True),
    ("no-at",    False),
    ("",         False),
], ids=["valid_email", "missing_at", "empty"])
def test_validate(email, valid):
    assert is_valid(email) is valid

# Stack parametrize → cartesian product
@pytest.mark.parametrize("x", [1, 2])
@pytest.mark.parametrize("y", ["a", "b"])
def test_combos(x, y): ...              # runs 4 times
\`\`\``,
        },
        {
          q: "Mocking — unittest.mock and pytest-mock",
          a: `\`\`\`python
from unittest.mock import Mock, MagicMock, patch, AsyncMock

# Basic mock
m = Mock()
m.foo(1, 2)                           # accepts any call
m.foo.assert_called_once_with(1, 2)

# Set return value / side effect
m.bar.return_value = 42
m.baz.side_effect = ValueError("boom")     # raises when called
m.iter.side_effect = [1, 2, 3]             # returns these in order

# Patch — replace something for the duration of the test
def test_fetch(mocker):                # mocker fixture from pytest-mock
    mocker.patch("myapp.services.requests.get",
                 return_value=Mock(status_code=200, json=lambda: {"x": 1}))
    result = fetch_data()
    assert result == {"x": 1}

# Patch as decorator
@patch("myapp.email.smtp_send")
def test_welcome(mock_send):
    send_welcome("a@b.com")
    mock_send.assert_called_once()

# Patch as context manager
with patch("myapp.clock.now") as mock_now:
    mock_now.return_value = datetime(2026, 1, 1)
    assert is_new_year() is True

# Async mocks
m = AsyncMock()
m.fetch.return_value = "data"
await m.fetch()                       # coroutine
\`\`\`

**Rule:** patch where it's USED, not where it's defined. \`patch("myapp.service.requests.get")\`, not \`patch("requests.get")\`.`,
        },
        {
          q: "Markers and skipping",
          a: `\`\`\`python
import pytest, sys

@pytest.mark.skip(reason="broken, ticket #123")
def test_wip(): ...

@pytest.mark.skipif(sys.version_info < (3, 11), reason="requires 3.11+")
def test_new_syntax(): ...

@pytest.mark.xfail(reason="known bug, fix in v2")
def test_known_bug():
    assert buggy_function() == 42     # expected to fail

@pytest.mark.slow                     # custom marker
def test_integration(): ...

# Run only marked / skip marked
# pytest -m slow
# pytest -m "not slow"

# Register custom markers in pyproject.toml to avoid warnings
# [tool.pytest.ini_options]
# markers = ["slow: slow integration tests", "db: requires database"]
\`\`\``,
        },
        {
          q: "Coverage and CI basics",
          a: `\`\`\`bash
# Install
pip install pytest pytest-cov

# Run with coverage
pytest --cov=myapp --cov-report=term-missing --cov-report=html

# Fail CI if coverage drops
pytest --cov=myapp --cov-fail-under=80
\`\`\`

**In \`pyproject.toml\`:**
\`\`\`toml
[tool.pytest.ini_options]
addopts = "-ra --strict-markers --strict-config"
testpaths = ["tests"]

[tool.coverage.run]
branch = true
source = ["src/myapp"]

[tool.coverage.report]
exclude_lines = [
    "pragma: no cover",
    "raise NotImplementedError",
    "if TYPE_CHECKING:",
]
\`\`\`

**CI checks to run on every PR:** \`ruff check\`, \`ruff format --check\`, \`mypy\`, \`pytest --cov\`, \`bandit\` (security).`,
        },
      ],
    },

    // ============ PERFORMANCE ============
    {
      cat: "performance",
      icon: <Zap size={18} />,
      title: "19. Performance & Profiling",
      level: "Senior",
      items: [
        {
          q: "Profile first, optimize second",
          a: `**Measure before guessing.** Python has excellent profiling tools.

\`\`\`python
# --- timeit for micro-benchmarks ---
import timeit
timeit.timeit("sum(range(100))", number=100_000)
timeit.timeit("'-'.join(str(n) for n in range(100))", number=10_000)

# cli
# python -m timeit -n 10000 "sum(range(100))"

# --- cProfile for full programs ---
import cProfile, pstats
profiler = cProfile.Profile()
profiler.enable()
run_my_app()
profiler.disable()

stats = pstats.Stats(profiler).sort_stats("cumulative")
stats.print_stats(20)            # top 20

# cli
# python -m cProfile -o out.prof my_script.py
# Then: snakeviz out.prof      (flame-graph viewer)

# --- line_profiler (3rd party) for per-line timing ---
# pip install line_profiler
# @profile decorator, then: kernprof -l -v script.py

# --- memory_profiler / tracemalloc (stdlib) ---
import tracemalloc
tracemalloc.start()
run_my_code()
snapshot = tracemalloc.take_snapshot()
for stat in snapshot.statistics("lineno")[:10]:
    print(stat)
\`\`\``,
        },
        {
          q: "Common Python performance wins",
          a: `**1. Use built-ins and C-accelerated stdlib.** They're written in C.
\`\`\`python
# Slow
total = 0
for x in lst:
    total += x
# Fast (written in C)
total = sum(lst)
\`\`\`

**2. Batch allocations — use comprehensions or generators.**
\`\`\`python
# Slow — repeated list growth
result = []
for x in lst:
    if pred(x):
        result.append(f(x))
# Fast
result = [f(x) for x in lst if pred(x)]
\`\`\`

**3. Local variable lookup is faster than attribute lookup.**
\`\`\`python
# Slow — re-looks up math.sqrt every iter
import math
for x in big_list:
    r = math.sqrt(x)
# Fast
sqrt = math.sqrt
for x in big_list:
    r = sqrt(x)
\`\`\`

**4. Use sets/dicts for membership tests.**
\`\`\`python
# O(n)
if x in big_list: ...
# O(1)
if x in big_set: ...
\`\`\`

**5. \`__slots__\` for millions of small objects.**

**6. Avoid global state in hot loops** — accessing globals is slower than locals.

**7. Use \`array.array\` or NumPy for homogeneous numeric data.**

**8. For string building, use \`"".join(list)\` not \`+=\`.**

**9. Cache expensive function results with \`@lru_cache\` or \`@cache\`.**

**10. For CPU-bound work in a loop, consider Cython, Numba, or rewriting the hot path in Rust (PyO3) / C.**`,
        },
        {
          q: "C-extensions and the GIL for speed",
          a: `\`\`\`python
# NumPy releases the GIL during vector ops — real parallelism with threads
import numpy as np
from concurrent.futures import ThreadPoolExecutor

def compute(arr):
    return np.fft.fft(arr).real.sum()  # C code, GIL released

with ThreadPoolExecutor(8) as ex:
    results = list(ex.map(compute, arrays))  # parallel!

# Pandas with vectorized ops is 100-1000x faster than Python loops:
df["total"] = df["price"] * df["qty"]      # vectorized
# vs
# df["total"] = [p*q for p, q in zip(df["price"], df["qty"])]   # slow
\`\`\`

**Fast libraries to know:**
- **NumPy** — numeric arrays, vector math
- **Pandas / Polars** — dataframes (Polars is faster, Rust-based)
- **orjson / msgspec** — 10-50x faster JSON than stdlib
- **uvloop** — 2-4x faster event loop (drop-in for asyncio)
- **Cython / Mypyc / Numba** — AOT/JIT compile Python to C
- **PyO3** — write hot paths in Rust, call from Python`,
        },
        {
          q: "Memory optimization techniques",
          a: `\`\`\`python
# --- 1. __slots__ — no __dict__ per instance ---
class Point:
    __slots__ = ("x", "y")             # saves ~200 bytes per instance
    def __init__(self, x, y): self.x, self.y = x, y

# --- 2. Generators instead of lists for large pipelines ---
# Materialized: builds the whole list
squares = [x*x for x in range(10**7)]          # ~350 MB
# Lazy: only one value at a time
squares = (x*x for x in range(10**7))          # ~200 bytes

# --- 3. Use array.array for homogeneous numeric data ---
from array import array
a = array("i", range(10**6))            # C int array — ~4 MB
# vs list of Python ints — ~30+ MB

# --- 4. Use bytes/bytearray for binary, not list of ints ---
# --- 5. Weak references for caches ---
import weakref
cache = weakref.WeakValueDictionary()   # entries auto-removed when unused

# --- 6. Profile with tracemalloc ---
import tracemalloc
tracemalloc.start()
before = tracemalloc.take_snapshot()
do_something()
after = tracemalloc.take_snapshot()
for stat in after.compare_to(before, "lineno")[:10]:
    print(stat)
\`\`\``,
        },
      ],
    },

    // ============ SECURITY ============
    {
      cat: "stdlib",
      icon: <Shield size={18} />,
      title: "20. Security Essentials",
      level: "Senior",
      items: [
        {
          q: "Common Python security pitfalls",
          a: `**1. Never use \`eval\`/\`exec\` on untrusted input** — arbitrary code execution.
\`\`\`python
# ❌ DANGER — user input
eval(f"calc({user_input})")
# ✅ Use ast.literal_eval for safe literal parsing
import ast
ast.literal_eval("[1, 2, 3]")            # safe — only literals
\`\`\`

**2. Never unpickle untrusted data** — \`pickle.loads\` executes arbitrary code on load. Use JSON or msgpack for untrusted sources.

**3. Never use \`shell=True\` with user input** — shell injection.
\`\`\`python
# ❌
subprocess.run(f"ls {user_path}", shell=True)
# ✅
subprocess.run(["ls", user_path], shell=False)
\`\`\`

**4. SQL injection — always parameterize.**
\`\`\`python
# ❌
cursor.execute(f"SELECT * FROM users WHERE id = {user_id}")
# ✅
cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
\`\`\`

**5. Path traversal — validate paths.**
\`\`\`python
from pathlib import Path
base = Path("/var/app/uploads").resolve()
requested = (base / user_filename).resolve()
if not requested.is_relative_to(base):    # 3.9+
    raise ValueError("escape attempt")
\`\`\`

**6. Use \`secrets\`, not \`random\`, for tokens/passwords.**

**7. Use \`hmac.compare_digest\`, not \`==\`, for secret comparison** — timing attacks.

**8. Keep deps patched** — \`pip-audit\` or Dependabot for CVEs.`,
        },
        {
          q: "Password hashing done right",
          a: `\`\`\`python
# ❌ Never use md5/sha1/sha256 for passwords — too fast to crack
# ✅ Use argon2 (best), bcrypt, or scrypt — slow on purpose

# --- argon2 (recommended) ---
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

ph = PasswordHasher()
hash = ph.hash("correct horse battery staple")
# '$argon2id$v=19$m=65536,t=3,p=4$...'  — salt is included

try:
    ph.verify(hash, user_input)
    if ph.check_needs_rehash(hash):
        new_hash = ph.hash(user_input)   # upgrade to newer params
except VerifyMismatchError:
    raise InvalidCredentials

# --- bcrypt (also fine) ---
import bcrypt
hashed = bcrypt.hashpw(pw.encode(), bcrypt.gensalt(rounds=12))
if bcrypt.checkpw(user_input.encode(), hashed):
    ...
\`\`\``,
        },
        {
          q: "Secrets management",
          a: `**Never commit secrets to git.** If you do, rotate them immediately — they're compromised.

\`\`\`python
# 1. Environment variables (12-factor app)
import os
DB_URL = os.environ["DATABASE_URL"]       # crash if missing
API_KEY = os.environ.get("API_KEY")       # allow None

# 2. pydantic-settings
from pydantic_settings import BaseSettings
class Settings(BaseSettings):
    db_url: str
    api_key: str
    class Config:
        env_file = ".env"

# 3. .env file for local dev (gitignored!)
# .gitignore: .env

# 4. Production: AWS Secrets Manager / HashiCorp Vault / GCP Secret Manager
import boto3
sm = boto3.client("secretsmanager")
secret = sm.get_secret_value(SecretId="prod/db")["SecretString"]

# 5. Scan for leaked secrets before commit
# pip install detect-secrets ; pre-commit hook
\`\`\``,
        },
      ],
    },

    // ============ ASYNC ADVANCED ============
    {
      cat: "advanced",
      icon: <Cpu size={18} />,
      title: "21. Async/Await Deep Dive",
      level: "Senior",
      items: [
        {
          q: "Coroutines, tasks, futures — the mental model",
          a: `\`\`\`python
import asyncio

# Coroutine — defined with 'async def', NOT running yet
async def fetch(url): return ...

coro = fetch("/")                     # just a coroutine object, not started

# Running a coroutine
asyncio.run(coro)                     # start event loop, run coro, stop loop

# Task — a coroutine scheduled on the loop, running concurrently
async def main():
    task = asyncio.create_task(fetch("/"))   # STARTED immediately
    result = await task                        # wait for result
\`\`\`

**Key distinctions:**
- **Coroutine** = paused function, needs \`await\` or \`run()\` to execute
- **Task** = coroutine scheduled on the event loop, runs concurrently
- **Future** = low-level placeholder for a result; \`Task\` is a \`Future\` subclass
- \`await coro\` runs sequentially; \`await task\` waits for already-running work

**Rule:** forgetting \`await\` returns a coroutine object (not the result) and produces a RuntimeWarning. Always \`await\` or schedule via \`create_task\`.`,
        },
        {
          q: "asyncio.gather vs TaskGroup vs as_completed",
          a: `\`\`\`python
import asyncio

# --- gather: wait for all, get results in order ---
results = await asyncio.gather(fetch(u1), fetch(u2), fetch(u3))

# With error handling
results = await asyncio.gather(
    fetch(u1), fetch(u2), fetch(u3),
    return_exceptions=True,           # one failure doesn't cancel others
)

# --- TaskGroup (3.11+, preferred) — structured concurrency ---
async with asyncio.TaskGroup() as tg:
    t1 = tg.create_task(fetch(u1))
    t2 = tg.create_task(fetch(u2))
    t3 = tg.create_task(fetch(u3))
# All tasks awaited at end of 'with'.
# If ANY raises, all others are cancelled → cleaner error semantics.
print(t1.result(), t2.result(), t3.result())

# --- as_completed: handle results as they arrive ---
async def handle_all(urls):
    tasks = [asyncio.create_task(fetch(u)) for u in urls]
    for coro in asyncio.as_completed(tasks):
        try:
            result = await coro
            print("got:", result)
        except Exception as e:
            print("failed:", e)
\`\`\`

**Rule of thumb:** Python 3.11+ → prefer \`TaskGroup\` for new code. Use \`gather(return_exceptions=True)\` when you want partial success. Use \`as_completed\` for streaming results.`,
        },
        {
          q: "Timeouts, cancellation, shielding",
          a: `\`\`\`python
import asyncio

# --- Timeout (3.11+): asyncio.timeout ---
async def fetch_with_timeout():
    try:
        async with asyncio.timeout(5.0):
            return await slow_operation()
    except asyncio.TimeoutError:
        log.warning("timed out")

# Old way (still works)
try:
    result = await asyncio.wait_for(slow_operation(), timeout=5.0)
except asyncio.TimeoutError:
    ...

# --- Manual cancellation ---
task = asyncio.create_task(long_running())
await asyncio.sleep(1)
task.cancel()                          # sends CancelledError into the task
try:
    await task
except asyncio.CancelledError:
    log.info("task cancelled")

# --- shield: protect a critical section from cancellation ---
async def atomic_operation():
    try:
        # even if outer task is cancelled, this completes
        await asyncio.shield(commit_to_db())
    except asyncio.CancelledError:
        log.warning("outer cancelled, but db commit already done")
        raise

# --- Proper cleanup on cancel ---
async def worker():
    try:
        while True:
            await do_work()
    except asyncio.CancelledError:
        await cleanup()                # CRITICAL — don't swallow silently
        raise                          # re-raise so parent knows
\`\`\``,
        },
        {
          q: "Mixing sync and async — don't block the loop",
          a: `\`\`\`python
import asyncio, time

# ❌ BLOCKS the entire event loop for 5 seconds — nothing else runs
async def bad():
    time.sleep(5)
    return "done"

# ✅ async sleep — yields control
async def good():
    await asyncio.sleep(5)
    return "done"

# --- Running CPU-bound or blocking IO without stalling the loop ---
# 3.9+: asyncio.to_thread (simple)
async def do_heavy():
    result = await asyncio.to_thread(expensive_sync_fn, arg1, arg2)
    return result

# Older / more control: run_in_executor
loop = asyncio.get_running_loop()
result = await loop.run_in_executor(None, expensive_sync_fn, arg)

# For CPU-bound — use ProcessPoolExecutor
from concurrent.futures import ProcessPoolExecutor
with ProcessPoolExecutor() as pool:
    result = await loop.run_in_executor(pool, cpu_heavy_fn, arg)
\`\`\`

**Golden rule of asyncio:** NEVER call blocking code from an async function. \`time.sleep\`, \`requests.get\`, CPU-heavy loops — all wreck concurrency. Use async equivalents (\`asyncio.sleep\`, \`httpx.AsyncClient\`, \`aiohttp\`) or offload via \`to_thread\`/\`run_in_executor\`.`,
        },
        {
          q: "Async context managers and iterators",
          a: `\`\`\`python
# --- Async context manager ---
class AsyncResource:
    async def __aenter__(self):
        self.conn = await connect()
        return self.conn
    async def __aexit__(self, exc_type, exc, tb):
        await self.conn.close()
        return False

async with AsyncResource() as conn:
    await conn.query(...)

# Or via decorator
from contextlib import asynccontextmanager

@asynccontextmanager
async def acquire_lock(lock):
    await lock.acquire()
    try: yield
    finally: lock.release()

# --- Async iterator ---
class AsyncRange:
    def __init__(self, n): self.n, self.i = n, 0
    def __aiter__(self): return self
    async def __anext__(self):
        if self.i >= self.n:
            raise StopAsyncIteration
        self.i += 1
        await asyncio.sleep(0)         # yield control
        return self.i - 1

async for x in AsyncRange(5):
    print(x)

# --- Async generator (preferred) ---
async def async_range(n):
    for i in range(n):
        await asyncio.sleep(0)
        yield i

# --- Async comprehensions ---
result = [x async for x in async_range(10) if x > 5]
\`\`\``,
        },
        {
          q: "Semaphores, locks, queues — async primitives",
          a: `\`\`\`python
import asyncio

# --- Semaphore: bound concurrency ---
sem = asyncio.Semaphore(10)           # max 10 concurrent

async def rate_limited(url):
    async with sem:
        return await fetch(url)

# --- Lock: mutual exclusion (rarely needed in async) ---
lock = asyncio.Lock()
async with lock:
    # critical section
    ...

# --- Event: signal between tasks ---
ready = asyncio.Event()

async def waiter():
    await ready.wait()
    print("go!")

async def starter():
    await asyncio.sleep(1)
    ready.set()

# --- Queue: producer/consumer ---
q: asyncio.Queue = asyncio.Queue(maxsize=100)

async def producer():
    for item in range(1000):
        await q.put(item)              # blocks if full — backpressure
    await q.put(None)                  # sentinel

async def consumer():
    while True:
        item = await q.get()
        if item is None: break
        await process(item)
        q.task_done()
\`\`\`

**When to use \`asyncio.Lock\`?** Rarely. Coroutines run sequentially until they \`await\` — most shared-state bugs from threading don't exist here. You need it if a task holds shared state across multiple \`await\` points.`,
        },
      ],
    },

    // ============ DATABASES / ORM ============
    {
      cat: "stdlib",
      icon: <Database size={18} />,
      title: "22. Databases, ORMs & Persistence",
      level: "Senior",
      items: [
        {
          q: "DB-API 2.0 — the standard Python DB interface",
          a: `Every Python DB driver (psycopg, mysqlclient, sqlite3) follows PEP 249.

\`\`\`python
import sqlite3

# Connection + cursor + parameterized query + context manager
with sqlite3.connect("app.db") as conn:
    conn.row_factory = sqlite3.Row     # rows as dict-like
    cur = conn.cursor()
    cur.execute(
        "SELECT id, email FROM users WHERE active = ? AND created_at > ?",
        (True, "2026-01-01"),           # ALWAYS parameterize — prevents SQL injection
    )
    for row in cur.fetchall():
        print(row["id"], row["email"])
    # conn.commit() on exit, or conn.rollback() if exception

# --- Bulk insert — MUCH faster than loop of execute() ---
cur.executemany(
    "INSERT INTO users (email, name) VALUES (?, ?)",
    [("a@b.com", "Alice"), ("c@d.com", "Bob")],
)

# --- Fetch options ---
cur.fetchone()        # one row, or None
cur.fetchmany(100)    # next N rows
cur.fetchall()        # remaining rows (careful with huge result sets)
for row in cur:       # iterate lazily — preferred for big queries
    ...
\`\`\`

**Security rule:** NEVER f-string SQL with user input. Always use parameter placeholders (\`?\` for SQLite, \`%s\` for psycopg, \`:name\` for SQLAlchemy).`,
        },
        {
          q: "Connection pooling — essential in production",
          a: `Opening a DB connection takes 10-100ms. Don't do it per request.

\`\`\`python
# --- psycopg3 with pool ---
from psycopg_pool import ConnectionPool

pool = ConnectionPool(
    conninfo="postgresql://user:pass@host/db",
    min_size=2,
    max_size=20,
    timeout=10.0,                      # wait for a connection
    max_idle=300,                      # close idle after 5 min
)

def fetch_user(user_id: int):
    with pool.connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM users WHERE id = %s", (user_id,))
            return cur.fetchone()

# --- SQLAlchemy (any backend) ---
from sqlalchemy import create_engine
engine = create_engine(
    "postgresql+psycopg://user:pass@host/db",
    pool_size=20,                      # permanent connections
    max_overflow=10,                   # bursts allowed
    pool_pre_ping=True,                # test connection before use
    pool_recycle=3600,                 # refresh connections after 1hr
)
\`\`\`

**Tune for your workload:** \`pool_size\` ≥ typical concurrent requests, \`max_overflow\` for spikes. Monitor with \`engine.pool.status()\`.`,
        },
        {
          q: "SQLAlchemy 2.0 — modern ORM style",
          a: `\`\`\`python
from __future__ import annotations
from datetime import datetime
from sqlalchemy import String, ForeignKey, create_engine, select
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, Session

class Base(DeclarativeBase): ...

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(100))
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    orders: Mapped[list["Order"]] = relationship(back_populates="user")

class Order(Base):
    __tablename__ = "orders"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    amount_cents: Mapped[int]
    user: Mapped[User] = relationship(back_populates="orders")

engine = create_engine("postgresql+psycopg://...")
Base.metadata.create_all(engine)

# --- Session pattern: short-lived, one per unit of work ---
with Session(engine) as session, session.begin():
    user = User(email="a@b.com", name="Alice")
    session.add(user)
    # commit on __exit__, rollback on exception

# --- Modern select() syntax ---
with Session(engine) as session:
    stmt = select(User).where(User.email == "a@b.com")
    user = session.scalars(stmt).one_or_none()

    # Join + filter
    stmt = (select(User, Order)
            .join(Order)
            .where(Order.amount_cents > 1000))
    for user, order in session.execute(stmt):
        print(user.name, order.amount_cents)
\`\`\``,
        },
        {
          q: "N+1 query problem — the classic ORM trap",
          a: `\`\`\`python
# ❌ N+1 — one query for users, then N queries for orders
users = session.scalars(select(User)).all()          # 1 query
for u in users:
    print(u.name, len(u.orders))                     # N queries! (lazy load)

# ✅ Eager load with joinedload — ONE query
from sqlalchemy.orm import joinedload
users = session.scalars(
    select(User).options(joinedload(User.orders))
).unique().all()
for u in users:
    print(u.name, len(u.orders))                     # already loaded

# ✅ selectinload — TWO queries (users + one IN query for all orders)
# Better for collections, avoids Cartesian product
from sqlalchemy.orm import selectinload
stmt = select(User).options(selectinload(User.orders))
\`\`\`

**Rule:** when iterating relationships, ALWAYS eager-load. Add \`echo=True\` to your engine in dev to see the actual queries.

**How to detect in production:** enable query logging and alert on requests with >10 queries. Libraries like \`nplusone\` or APM tools (Sentry, DataDog) flag this automatically.`,
        },
        {
          q: "Transactions, isolation levels, savepoints",
          a: `\`\`\`python
# --- Explicit transaction ---
with Session(engine) as session:
    with session.begin():               # commit on success, rollback on error
        session.add(User(email="a@b.com"))
        session.flush()                 # send INSERT but don't commit
        # ... more work ...
    # committed here

# --- Savepoints (nested transactions) ---
with session.begin():
    session.add(a)
    try:
        with session.begin_nested():    # SAVEPOINT
            session.add(b)
            session.flush()             # might fail with IntegrityError
    except IntegrityError:
        pass                            # partial rollback to savepoint
    session.add(c)                      # still committed with a
\`\`\`

**Isolation levels (Postgres):**
- \`READ COMMITTED\` (default) — see only committed data
- \`REPEATABLE READ\` — snapshot at transaction start
- \`SERIALIZABLE\` — strict; may abort with serialization error

\`\`\`python
engine = create_engine(..., isolation_level="REPEATABLE READ")

# Per-connection override
with engine.connect().execution_options(isolation_level="SERIALIZABLE") as conn:
    ...
\`\`\`

**Interview key points:** transactions are all-or-nothing; isolation prevents race conditions; \`SELECT FOR UPDATE\` for row-level locking; DB-level advisory locks for cross-request mutual exclusion.`,
        },
        {
          q: "Migrations with Alembic",
          a: `\`\`\`bash
# Initial setup
alembic init alembic

# Generate migration from model changes
alembic revision --autogenerate -m "add user email index"

# Review the generated migration file — NEVER blindly trust autogen!
# Apply
alembic upgrade head
# Revert one step
alembic downgrade -1
# Check current version
alembic current
\`\`\`

\`\`\`python
# versions/xxxx_add_user_email_index.py
def upgrade() -> None:
    op.create_index("ix_users_email", "users", ["email"], unique=True)

def downgrade() -> None:
    op.drop_index("ix_users_email", table_name="users")
\`\`\`

**Production rules:**
- Review autogenerated migrations (they miss renames, custom types)
- Make migrations BACKWARD-COMPATIBLE for rolling deploys
- Never rename columns in a single step — add new, backfill, dual-write, remove old
- Test downgrade paths`,
        },
        {
          q: "Async DB with asyncpg / SQLAlchemy async",
          a: `\`\`\`python
# --- asyncpg (low-level, fast) ---
import asyncpg

async def main():
    pool = await asyncpg.create_pool("postgresql://...", min_size=5, max_size=20)
    async with pool.acquire() as conn:
        rows = await conn.fetch("SELECT id, name FROM users WHERE active = $1", True)
        for r in rows:
            print(r["id"], r["name"])
    await pool.close()

# --- SQLAlchemy 2.0 async ---
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession

engine = create_async_engine("postgresql+asyncpg://...")

async def fetch_user(user_id: int):
    async with AsyncSession(engine) as session:
        result = await session.execute(
            select(User).where(User.id == user_id)
        )
        return result.scalar_one_or_none()
\`\`\`

**When async DB actually helps:** high-concurrency APIs (FastAPI with many concurrent requests). Low-concurrency or CPU-bound apps get no benefit.`,
        },
      ],
    },

    // ============ DEBUGGING ============
    {
      cat: "testing",
      icon: <Brain size={18} />,
      title: "23. Debugging & Introspection",
      level: "Mid → Senior",
      items: [
        {
          q: "pdb — the interactive debugger",
          a: `\`\`\`python
# --- Drop into debugger at a specific line ---
def suspicious():
    x = compute()
    breakpoint()                       # 3.7+ — preferred
    # pre-3.7: import pdb; pdb.set_trace()
    return x * 2

# --- Run a script under pdb ---
# python -m pdb script.py

# --- Post-mortem: debug after an uncaught exception ---
# python -m pdb -c continue script.py
# or in code:
import pdb, sys
try:
    main()
except Exception:
    pdb.post_mortem(sys.exc_info()[2])
\`\`\`

**Commands to know:**
- \`n\` next (step over)
- \`s\` step into
- \`c\` continue
- \`r\` return from current function
- \`l\` list source around current line
- \`p expr\` print expression value
- \`pp expr\` pretty print
- \`w\` where (stack trace)
- \`u\` / \`d\` up / down the stack
- \`b 42\` set breakpoint at line 42
- \`cl\` clear breakpoints
- \`q\` quit
- Any Python expression works at the \`(Pdb)\` prompt

**Nicer alternatives:** \`pdbpp\` (drop-in replacement), \`ipdb\` (IPython-based), IDE debuggers (PyCharm, VS Code).`,
        },
        {
          q: "Reading tracebacks — from the top or bottom?",
          a: `\`\`\`
Traceback (most recent call last):
  File "app.py", line 42, in <module>
    main()
  File "app.py", line 30, in main
    result = process(data)
  File "app.py", line 15, in process
    return data["key"]
KeyError: 'key'
\`\`\`

**Read from BOTTOM:**
1. Start with the **exception type + message** at the bottom — that's what actually happened
2. Then look at the **last frame** — that's where it happened (\`line 15, in process\`)
3. Walk UP only if you need to understand the call path

**Python 3.11+ adds "fine-grained" tracebacks** — underlines the exact expression that failed:
\`\`\`
    return data["key"]
           ~~~~~^^^^^^^
KeyError: 'key'
\`\`\`

**Exception chaining:**
- \`raise X from e\` → shows both with "The above exception was the direct cause of..."
- bare \`raise X\` during handling of another → "During handling of the above exception..."
- \`raise X from None\` → suppresses the chain`,
        },
        {
          q: "Logging vs print vs assert",
          a: `- **print** → scripts, temp debugging. Not for production.
- **logging** → everything in production. Configurable, leveled, structured.
- **assert** → developer-facing invariants, checked in dev, STRIPPED with \`-O\` flag. Never use for input validation!

\`\`\`python
# ❌ WRONG — asserts are removed in -O
def withdraw(account, amount):
    assert amount > 0, "amount must be positive"    # doesn't protect prod!
    ...

# ✅ Use real validation for user input
def withdraw(account, amount):
    if amount <= 0:
        raise ValueError("amount must be positive")
\`\`\`

**Logging levels:** \`DEBUG\` (10) < \`INFO\` (20) < \`WARNING\` (30) < \`ERROR\` (40) < \`CRITICAL\` (50). Production usually runs at INFO or WARNING.`,
        },
        {
          q: "Introspection tools: inspect, dis, sys",
          a: `\`\`\`python
import inspect

# What's inside a module/class
inspect.getmembers(obj)
inspect.getmembers(obj, inspect.isfunction)
inspect.getsource(fn)              # source code
inspect.getfile(fn)                # file path
inspect.signature(fn)              # signature object
inspect.signature(fn).parameters   # dict of Parameter objects

# Who's calling me?
frame = inspect.currentframe()
caller = frame.f_back
caller.f_code.co_name              # caller's function name
caller.f_lineno                    # caller's line number
caller.f_locals                    # caller's local variables

# What bytecode is this?
import dis
dis.dis(my_function)               # disassemble to bytecode

# sys essentials
import sys
sys.version, sys.platform, sys.executable
sys.argv                           # command-line args
sys.path                           # import search path
sys.stdout, sys.stderr             # redirect-able streams
sys.exit(1)                        # exit with status
sys.getsizeof(obj)                 # approx memory size
sys.setrecursionlimit(10_000)
\`\`\``,
        },
        {
          q: "Reproducing flaky tests",
          a: `\`\`\`bash
# pytest — seed and order
pytest --randomly-seed=12345       # pytest-randomly: reproduce a specific order
pytest -p no:randomly              # disable randomization
pytest --count=100                 # pytest-repeat: run tests N times

# Run a failing test many times
pytest tests/test_foo.py::test_flaky --count=50

# Check for test isolation issues
pytest --forked                    # pytest-forked: each test in its own process
\`\`\`

**Common causes of flakiness:**
- Test order dependency (state leaking between tests)
- Time-based code (\`datetime.now\`, \`time.time\`) — use \`freezegun\` or pass clock as dependency
- Random seeds not fixed
- Network / DB / filesystem state
- Concurrency races (especially in async code)
- Garbage collection timing (use \`gc.collect()\` at setUp)`,
        },
      ],
    },

    // ============ MODERN PYTHON FEATURES ============
    {
      cat: "extras",
      icon: <Sparkles size={18} />,
      title: "24. Modern Python (3.10 → 3.13)",
      level: "Mid → Senior",
      items: [
        {
          q: "Structural pattern matching (3.10+)",
          a: `\`\`\`python
def handle(event):
    match event:
        # Literal match
        case {"type": "ping"}:
            return "pong"

        # Capture values
        case {"type": "user_created", "id": user_id, "name": name}:
            welcome(user_id, name)

        # Class pattern
        case HttpResponse(status=200, body=body):
            return body
        case HttpResponse(status=status) if 400 <= status < 500:
            raise ClientError(status)
        case HttpResponse(status=status) if status >= 500:
            raise ServerError(status)

        # Sequence patterns
        case [first, *rest]:
            return (first, rest)
        case []:
            return None

        # OR patterns
        case "get" | "head" | "options":
            return "read"

        # Guards
        case {"amount": amt} if amt > 0:
            process(amt)

        # Wildcard (must be last)
        case _:
            log.warning("unknown event: %s", event)
\`\`\`

**Key rules:**
- Bare names capture (\`case x\` binds x = subject)
- Dotted names are constants (\`case Color.RED\`)
- \`_\` is wildcard, doesn't bind
- Cases are tried top to bottom, first match wins
- For class matches, define \`__match_args__\` on your classes`,
        },
        {
          q: "Exception groups and except* (3.11+)",
          a: `When multiple things fail at once (e.g., TaskGroup), you get all errors together.

\`\`\`python
import asyncio

async def main():
    try:
        async with asyncio.TaskGroup() as tg:
            tg.create_task(task_a())     # raises ValueError
            tg.create_task(task_b())     # raises TypeError
    except* ValueError as eg:
        for exc in eg.exceptions:
            print("value error:", exc)
    except* TypeError as eg:
        print("type error:", eg.exceptions)

# Create one manually
try:
    raise ExceptionGroup("validation failed", [
        ValueError("bad email"),
        ValueError("bad age"),
    ])
except* ValueError as eg:
    for e in eg.exceptions:
        print(e)
\`\`\`

\`except*\` matches a type inside the group, re-raising unmatched parts. Regular \`except\` on an ExceptionGroup catches the whole group.`,
        },
        {
          q: "Self type, TypeVarTuple, ParamSpec (typing modernization)",
          a: `\`\`\`python
from typing import Self, ParamSpec, TypeVarTuple, Unpack

# --- Self (3.11+) — cleaner than 'Foo' string ---
class Builder:
    def add(self, x) -> Self:             # returns same type, even for subclasses
        ...
        return self

# --- ParamSpec — preserve decorated function's signature ---
from typing import Callable
from functools import wraps

P = ParamSpec("P")
R = TypeVar("R")

def logged(fn: Callable[P, R]) -> Callable[P, R]:
    @wraps(fn)
    def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
        log.info("calling %s", fn.__name__)
        return fn(*args, **kwargs)
    return wrapper

# mypy/pyright sees the decorated function with its original signature intact

# --- TypeVarTuple — variadic generics ---
Ts = TypeVarTuple("Ts")
def zip_arrays(*arrays: Unpack[tuple[list, ...]]) -> list[tuple]:
    return list(zip(*arrays))
\`\`\``,
        },
        {
          q: "Assignment expressions (walrus := ) in production",
          a: `\`\`\`python
# --- Classic use: read in while loop ---
while (chunk := f.read(8192)):
    process(chunk)

# --- Regex: match + use in same breath ---
import re
if (m := re.match(r"user-(\\d+)", name)):
    user_id = int(m.group(1))

# --- List comprehensions: avoid recomputation ---
# ❌ computes f(x) twice
[f(x) for x in data if f(x) > 0]
# ✅ once
[y for x in data if (y := f(x)) > 0]

# --- Avoid ugly pre-compute ---
# Before
env = load_env()
if env and env.get("DEBUG"):
    log.setLevel("DEBUG")
# After
if (env := load_env()) and env.get("DEBUG"):
    log.setLevel("DEBUG")
\`\`\`

**Rule:** use walrus to eliminate obvious duplication or awkward patterns — not just to golf code.`,
        },
        {
          q: "What's new: positional-only, PEP 695 generics, TOML parsing",
          a: `\`\`\`python
# --- Positional-only parameters (3.8+) ---
def pow(base, exp, /, mod=None):          # base and exp CANNOT be kwargs
    ...

# --- PEP 695 generic syntax (3.12+) — cleaner than TypeVar ---
# Old way
from typing import TypeVar, Generic
T = TypeVar("T")
class Stack(Generic[T]): ...

# New way (3.12+)
class Stack[T]:
    def push(self, item: T) -> None: ...
    def pop(self) -> T: ...

def first[T](xs: list[T]) -> T:
    return xs[0]

type UserId = int                          # type alias statement (3.12+)

# --- Stdlib TOML parsing (3.11+) ---
import tomllib
with open("pyproject.toml", "rb") as f:
    config = tomllib.load(f)
\`\`\``,
        },
        {
          q: "f-string improvements (3.12+)",
          a: `3.12 lifted most f-string restrictions. You can now:

\`\`\`python
# Same quote character inside
f"{'nested'}"                 # used to need escaping
f"{d['key']}"                 # same quote as outer!

# Multi-line expressions
f"{
    some_long(
        expression()
    )
}"

# Backslashes in the expression
f"{'\\n'.join(items)}"         # previously forbidden

# Comments inside
f"{x # this is fine now
}"
\`\`\``,
        },
        {
          q: "Free-threaded Python (3.13+) — no-GIL is coming",
          a: `PEP 703 introduced an optional **GIL-free** CPython build (\`python3.13t\`).

**Status as of 2026:**
- Experimental, opt-in via special build
- Compatible C extensions must be updated (many not yet)
- Performance for single-threaded code is ~10-20% slower (locking overhead)
- For CPU-bound multi-threaded code: finally real parallelism

**What to tell an interviewer:** "The GIL is being removed in an optional build starting in 3.13. Most production code in 2026 still runs with the GIL; \`multiprocessing\` remains the right answer for CPU-bound parallelism. Free-threaded builds will likely become mainstream in 3.15–3.16 once key C extensions (NumPy, Pandas, etc.) are fully compatible."`,
        },
        {
          q: "`@override` decorator (3.12+)",
          a: `\`\`\`python
from typing import override

class Animal:
    def speak(self) -> str: ...

class Dog(Animal):
    @override                  # mypy/pyright verify this ACTUALLY overrides
    def speak(self) -> str:
        return "Woof"

class Cat(Animal):
    @override
    def speek(self) -> str:    # ← typo! @override catches it
        return "Meow"
\`\`\`

Catches typos, signature drift, and accidental "new method thought to be override" bugs. A great habit in any project with inheritance.`,
        },
      ],
    },

    // ============ TRICKY QUESTIONS ============
    {
      cat: "tricky",
      icon: <AlertTriangle size={18} />,
      title: "25. Tricky Questions / Gotchas",
      level: "All Levels",
      items: [
        {
          q: "What does this print? (mutable default)",
          a: `\`\`\`python
def append_to(x, lst=[]):
    lst.append(x)
    return lst

print(append_to(1))   # [1]
print(append_to(2))   # [1, 2]   ← surprise!
print(append_to(3))   # [1, 2, 3]
\`\`\`

The default \`[]\` is created ONCE at function-definition time, shared across all calls. Fix: \`lst=None\` sentinel.`,
        },
        {
          q: "Late binding in closures",
          a: `\`\`\`python
funcs = [lambda: i for i in range(3)]
print([f() for f in funcs])    # [2, 2, 2]  ← not [0, 1, 2]
\`\`\`

\`i\` is looked up WHEN the lambda is called — by then the loop is done and \`i == 2\`. Fix:
\`\`\`python
funcs = [lambda i=i: i for i in range(3)]   # capture default
# or
funcs = [functools.partial(lambda x: x, i) for i in range(3)]
\`\`\``,
        },
        {
          q: "is vs == on small ints / strings",
          a: `\`\`\`python
a = 256; b = 256; print(a is b)   # True  (cached)
a = 257; b = 257; print(a is b)   # False (usually)
a = "hi"; b = "hi"; print(a is b) # True  (interned literals)
\`\`\`

Never rely on \`is\` for equality — only for \`None\`, \`True\`, \`False\`, sentinels.`,
        },
        {
          q: "What is True in this case?",
          a: `\`\`\`python
print(True == 1)         # True
print(True + True)       # 2
print(True is 1)         # False
print([] == False)       # False (but bool([]) == False)
\`\`\`

\`bool\` is a subclass of \`int\`. But identity ≠ equality.`,
        },
        {
          q: "The chained comparison trap",
          a: `\`\`\`python
print(1 < 2 < 3)         # True  — chained, equivalent to 1<2 and 2<3
print(1 < 2 > 3)         # False — also chained!
print((1 < 2) < 3)       # True  — False < 3 → 0 < 3 → True  😬
\`\`\``,
        },
        {
          q: "List multiplication gotcha",
          a: `\`\`\`python
grid = [[0]*3] * 3
grid[0][0] = 9
print(grid)   # [[9,0,0], [9,0,0], [9,0,0]]   ← all rows are THE SAME list
\`\`\`

Fix: \`grid = [[0]*3 for _ in range(3)]\``,
        },
        {
          q: "*args, **kwargs — and the * bareword",
          a: `\`\`\`python
def f(a, b, *args, key, **kwargs):      # everything after * is keyword-only
    ...

f(1, 2, 3, 4, key="x", extra=5)
# a=1, b=2, args=(3,4), key="x", kwargs={"extra": 5}
\`\`\``,
        },
        {
          q: "__slots__ — memory optimization",
          a: `\`\`\`python
class Point:
    __slots__ = ("x", "y")   # no __dict__, can't add attrs
    def __init__(self, x, y): self.x, self.y = x, y
\`\`\`

Saves memory for millions of instances. Trade-off: no dynamic attributes, no weakref unless added.`,
        },
        {
          q: "What's the output?",
          a: `\`\`\`python
x = [1, 2, 3]
y = x
x = x + [4]
print(y)    # [1, 2, 3]   ← y unchanged

x = [1, 2, 3]
y = x
x += [4]
print(y)    # [1, 2, 3, 4]  ← y changed!
\`\`\`

\`x + [4]\` creates a new list, rebinds \`x\`.
\`x += [4]\` calls \`list.__iadd__\` — modifies in place, \`y\` sees it.`,
        },
        {
          q: "What's the difference between `sort()` and `sorted()`?",
          a: `\`\`\`python
a = [3, 1, 2]
b = a.sort()          # returns None! Sorts in place.
print(b)              # None
print(a)              # [1, 2, 3]

b = sorted(a)         # returns new list, doesn't modify a
\`\`\`

Same trap with \`list.reverse()\` (in-place, returns \`None\`) vs \`reversed(list)\` (returns iterator).

**Rule:** in Python, methods that mutate in place return \`None\` by convention. Never do \`x = lst.sort()\`.`,
        },
        {
          q: "Dict ordering — is it guaranteed?",
          a: `\`\`\`python
{"a": 1, "b": 2, "c": 3}
\`\`\`

**Python 3.7+**: dict preserves insertion order — GUARANTEED by language spec.
**Python 3.6**: CPython preserves it as implementation detail (not guaranteed).
**Python <= 3.5**: no ordering.

Since 3.7 you rarely need \`OrderedDict\`. You still need it for:
- \`move_to_end(key)\` method
- Equality that considers order (\`OrderedDict\` compares order; \`dict\` does not)`,
        },
        {
          q: "Generator exhaustion — tricky bug",
          a: `\`\`\`python
gen = (x * 2 for x in range(5))
list(gen)             # [0, 2, 4, 6, 8]
list(gen)             # [] ← exhausted! Can only be consumed once.

# Same with file iteration
with open("f.txt") as f:
    data1 = list(f)   # lines
    data2 = list(f)   # [] — cursor at EOF
\`\`\`

**Fix:** for reusable sequences, use a list, or a function that returns a fresh generator each call:
\`\`\`python
def make_gen(): return (x * 2 for x in range(5))
list(make_gen())      # fresh every time
\`\`\``,
        },
        {
          q: "Hash of NaN — the weirdness",
          a: `\`\`\`python
import math
nan = float("nan")
nan == nan            # False (!) — IEEE 754 says NaN is never equal to anything
nan is nan            # True  — same object

# But hash works:
hash(nan)             # 0 (some stable value)
{nan}                 # {nan} — in a set
nan in {nan}          # True — because 'in' checks identity first, then eq

d = {nan: "x"}
d[nan]                # "x" — works because same identity
d[float("nan")]       # KeyError — different NaN object, and != nan
\`\`\``,
        },
        {
          q: "`any()` and `all()` on empty iterables",
          a: `\`\`\`python
any([])               # False  (vacuous truth)
all([])               # True   (vacuous truth — no counterexample)

all([True])           # True
all([True, False])    # False
all(x > 0 for x in [])    # True  ← gotcha in validations!
\`\`\`

Trap: \`all(valid(x) for x in items)\` returns \`True\` when \`items\` is empty. Often you want \`items and all(...)\`.`,
        },
        {
          q: "`open()` without encoding — platform-dependent bug",
          a: `\`\`\`python
# ❌ Encoding depends on OS locale (utf-8 on Linux, cp1252 on Windows)
with open("file.txt") as f:
    content = f.read()       # works on your machine, blows up in production

# ✅ Always explicit
with open("file.txt", encoding="utf-8") as f:
    content = f.read()
\`\`\`

In Python 3.10+, you can enforce this via \`PYTHONWARNDEFAULTENCODING=1\` and it'll emit a warning wherever encoding is missing. Turn on in CI.`,
        },
        {
          q: "`bool` is an `int`",
          a: `\`\`\`python
isinstance(True, int)      # True
True + True                # 2
sum([True, False, True])   # 2

# Useful trick: count matches
matches = sum(1 for x in items if pred(x))
matches = sum(pred(x) for x in items)   # same — bool→int

# But be careful:
def f(x: int): ...
f(True)                     # passes type check, but probably not intended
\`\`\``,
        },
        {
          q: "Truthiness surprises",
          a: `\`\`\`python
# Everything is truthy EXCEPT:
bool(None)      # False
bool(False)     # False
bool(0)         # False
bool(0.0)       # False
bool("")        # False
bool([])        # False
bool({})        # False
bool(set())     # False
bool(())        # False

# Everything else is truthy, including:
bool("0")       # True  — nonempty string
bool("False")   # True  — nonempty string
bool([0])       # True  — nonempty list
bool({0})       # True
bool(object())  # True

# Custom classes — control via __bool__ or __len__
class Basket:
    def __init__(self, items): self.items = items
    def __bool__(self): return bool(self.items)     # or define __len__

if Basket([]): ...    # False
\`\`\``,
        },
        {
          q: "`copy.copy` vs `copy.deepcopy` on custom classes",
          a: `\`\`\`python
import copy

class Node:
    def __init__(self, value, children=None):
        self.value = value
        self.children = children or []

tree = Node("root", [Node("a"), Node("b")])
shallow = copy.copy(tree)
deep    = copy.deepcopy(tree)

shallow.children[0].value = "CHANGED"
print(tree.children[0].value)      # "CHANGED" — shared!
print(deep.children[0].value)      # "a" — independent
\`\`\`

Override \`__copy__\` and \`__deepcopy__\` for custom behavior (e.g., skip sockets, threads).`,
        },
        {
          q: "Multiple return values — tuple under the hood",
          a: `\`\`\`python
def stats():
    return 10, 20, 30             # actually returns a tuple

x = stats()                       # x = (10, 20, 30)
a, b, c = stats()                 # unpacked
a, *rest = stats()                # a=10, rest=[20, 30]
a, _, c = stats()                 # _ convention for "don't care"

# Return a NamedTuple for self-documenting code:
from typing import NamedTuple
class Stats(NamedTuple):
    min: int; max: int; mean: int

def stats() -> Stats: return Stats(10, 100, 55)
s = stats()
s.mean                             # 55
\`\`\``,
        },
        {
          q: "Chained dict `.get()` is ugly — use walrus or suppress",
          a: `\`\`\`python
# Deep access without exceptions
data = {"user": {"profile": {"email": "a@b.com"}}}

# ❌ ugly
if "user" in data and "profile" in data["user"] and "email" in data["user"]["profile"]:
    email = data["user"]["profile"]["email"]

# ✅ chained .get with defaults
email = data.get("user", {}).get("profile", {}).get("email")

# ✅ 3.11+: contextlib.suppress
from contextlib import suppress
email = None
with suppress(KeyError, TypeError):
    email = data["user"]["profile"]["email"]

# ✅ for JSON-like: jmespath, jsonpath, or pydantic validation
\`\`\``,
        },
        {
          q: "`self` isn't a keyword — just a convention",
          a: `\`\`\`python
class Foo:
    def bar(this, x):               # 'this' works — still the first arg
        this.x = x

# But everyone expects 'self'. Using anything else is a code review rejection.
# Same for @classmethod using 'cls'.
\`\`\`

Python's method resolution inserts the instance as the first argument — the parameter name doesn't matter. Follow the convention.`,
        },
        {
          q: "`except Exception` vs `except BaseException`",
          a: `\`\`\`python
try: ...
except Exception: ...         # catches 99% of errors — SAFE
# Does NOT catch: SystemExit, KeyboardInterrupt, GeneratorExit
#                 (these inherit from BaseException, not Exception)

try: ...
except BaseException: ...     # catches EVERYTHING including Ctrl+C
# Almost never what you want — user can't interrupt your program
\`\`\`

**Rule:** \`except Exception\` as the broad catch-all. Never bare \`except:\` or \`except BaseException:\`.`,
        },
        {
          q: "String interning — when `is` accidentally works",
          a: `\`\`\`python
a = "hello"
b = "hello"
a is b            # True — short literals are interned

a = "hello world, this is longer"
b = "hello world, this is longer"
a is b            # True — still interned, because compile-time constants

a = "".join(["h", "i"])
b = "".join(["h", "i"])
a is b            # False usually — runtime-constructed strings aren't interned

# Force interning (rarely needed)
import sys
a = sys.intern("some key string")
b = sys.intern("some key string")
a is b            # True — useful for massive dicts with string keys
\`\`\`

**Lesson:** \`is\` for strings is undefined behavior. Use \`==\`.`,
        },
        {
          q: "Classes are objects too",
          a: `\`\`\`python
class Foo: pass

type(Foo)              # <class 'type'>
type(Foo())            # <class '__main__.Foo'>
isinstance(Foo, type)  # True — classes are instances of type

# Create classes dynamically
Dog = type("Dog", (object,), {"speak": lambda self: "Woof"})
Dog().speak()          # 'Woof'

# Classes can be assigned, passed around, stored in dicts
models = {"user": User, "order": Order}
instance = models["user"](name="Alice")
\`\`\`

This underpins metaclasses, ORM magic (\`type(...)\` factories), and decorators that rewrite class definitions.`,
        },
        {
          q: "`sorted` is stable — use it for multi-key sort",
          a: `\`\`\`python
# Python's sort is STABLE: equal elements keep their relative order.
# So you can sort by multiple keys by sorting from least → most significant:

rows = [("Alice", 30), ("Bob", 25), ("Alice", 25), ("Bob", 30)]
rows.sort(key=lambda r: r[1])         # first by age
rows.sort(key=lambda r: r[0])         # then by name (stable, age order preserved)
# [('Alice', 25), ('Alice', 30), ('Bob', 25), ('Bob', 30)]

# OR — single sort with tuple key (usually preferred):
rows.sort(key=lambda r: (r[0], r[1]))
\`\`\``,
        },
        {
          q: "`dict | dict` merge (3.9+) vs `**` unpacking",
          a: `\`\`\`python
a = {"x": 1, "y": 2}
b = {"y": 3, "z": 4}

# Python 3.9+
merged = a | b                    # {'x': 1, 'y': 3, 'z': 4} — later wins
a |= b                            # in-place update

# Pre-3.9
merged = {**a, **b}               # same result
merged = dict(a, **b)             # same result

# For chains, ChainMap is lazier (no copy)
from collections import ChainMap
view = ChainMap(b, a)             # b overrides a, no actual merge
\`\`\``,
        },
      ],
    },

    // ============ PYTHONIC / EXTRAS ============
    {
      cat: "extras",
      icon: <Lightbulb size={18} />,
      title: "26. Pythonic Idioms & Extras",
      level: "All Levels",
      items: [
        {
          q: "Context managers & with",
          a: `\`\`\`python
# Built-in — file always closed, even on exception
with open("data.txt", encoding="utf-8") as f:
    data = f.read()

# DB transaction pattern — commit on success, rollback on error
from contextlib import contextmanager

@contextmanager
def transaction(conn):
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise                          # re-raise so caller sees the error
    finally:
        conn.close()

with transaction(get_connection()) as conn:
    conn.execute("UPDATE users SET active = 0 WHERE id = ?", (user_id,))
    # commit happens automatically; rollback on any exception
\`\`\`

**Class-based version (more flexible, supports async, reentrancy):**
\`\`\`python
import time
import logging

log = logging.getLogger(__name__)

class timed_block:
    """with timed_block('query'): ... → logs duration, even on exception."""
    def __init__(self, label: str):
        self.label = label
    def __enter__(self):
        self.start = time.perf_counter()
        return self
    def __exit__(self, exc_type, exc, tb):
        elapsed = time.perf_counter() - self.start
        log.info("%s took %.2f ms (error=%s)", self.label, elapsed * 1000, exc_type)
        return False                    # don't swallow exceptions

with timed_block("fetch_users"):
    users = db.query(...)
\`\`\`

**Rule:** return \`False\` (or nothing) from \`__exit__\` to let exceptions propagate. Return \`True\` only if you INTEND to swallow the exception — rarely what you want.`,
        },
        {
          q: "Dataclasses",
          a: `\`\`\`python
from __future__ import annotations
from dataclasses import dataclass, field
from datetime import datetime
from decimal import Decimal

@dataclass(frozen=True, slots=True, kw_only=True)   # Py 3.10+ for kw_only/slots
class Order:
    id: str
    customer_id: str
    amount: Decimal
    items: list[str] = field(default_factory=list)     # mutable default — MUST use factory
    created_at: datetime = field(default_factory=datetime.utcnow)
    metadata: dict = field(default_factory=dict, repr=False)   # hide from __repr__

    def __post_init__(self) -> None:
        # Runs after __init__ — perfect for validation
        if self.amount <= 0:
            raise ValueError(f"amount must be positive, got {self.amount}")
        if not self.id:
            raise ValueError("id cannot be empty")

o = Order(id="ORD-1", customer_id="C-42", amount=Decimal("9.99"))
# Order(id='ORD-1', customer_id='C-42', amount=Decimal('9.99'), items=[], created_at=...)
\`\`\`

**Production features demonstrated:**
- \`frozen=True\` → immutable, therefore hashable, safe to share across threads
- \`slots=True\` → no \`__dict__\`, lower memory for millions of instances
- \`kw_only=True\` → forces keyword args at call sites (prevents \`Order("C-42", "ORD-1", ...)\` bugs)
- \`field(default_factory=...)\` for mutable defaults (NEVER \`items: list = []\`)
- \`__post_init__\` for validation — raise at construction, not later
- \`repr=False\` to hide sensitive/noisy fields from logs`,
        },
        {
          q: "f-strings (3.6+, 3.8 debug, 3.12 improvements)",
          a: `\`\`\`python
x, y = 1, 2
f"{x + y}"           # '3'
f"{x=}"              # 'x=1'  (debug form, 3.8+)
f"{x:>5}"            # '    1' — right-align in 5 cols
f"{3.14159:.2f}"     # '3.14'
\`\`\``,
        },
        {
          q: "Walrus operator :=",
          a: `\`\`\`python
while (chunk := f.read(1024)):
    process(chunk)
# vs
while True:
    chunk = f.read(1024)
    if not chunk: break
    process(chunk)
\`\`\``,
        },
        {
          q: "Match statement (3.10+)",
          a: `\`\`\`python
def describe(pt):
    match pt:
        case (0, 0): return "origin"
        case (x, 0): return f"on x-axis at {x}"
        case (0, y): return f"on y-axis at {y}"
        case (x, y) if x == y: return "diagonal"
        case _: return "somewhere"
\`\`\``,
        },
        {
          q: "Collections module favorites",
          a: `- \`Counter\` — frequency counts (\`Counter("mississippi")\`)
- \`defaultdict\` — dict with default factory
- \`deque\` — O(1) ops at both ends
- \`OrderedDict\` — still useful for move-to-end
- \`namedtuple\` — lightweight immutable record`,
        },
        {
          q: "Typing & type hints",
          a: `\`\`\`python
from typing import Optional, Callable, Iterable

def top_k(items: Iterable[int], k: int = 10) -> list[int]:
    ...

def handler(cb: Callable[[int], None]) -> Optional[str]:
    ...
\`\`\`

Tools: \`mypy\`, \`pyright\`, \`ruff\`. Types improve IDEs, catch bugs early.`,
        },
      ],
    },

    // ============ EXCEPTIONS ============
    {
      cat: "basics",
      icon: <AlertTriangle size={18} />,
      title: "27. Exceptions — Errors, Raise, Context Managers",
      level: "All Levels",
      items: [
        {
          q: "Exception handling best practices",
          a: `\`\`\`python
from __future__ import annotations
import logging

log = logging.getLogger(__name__)

# --- Custom exception hierarchy — makes handling precise ---
class AppError(Exception):
    """Base for all application errors."""

class NotFound(AppError): ...
class ValidationError(AppError): ...
class UpstreamError(AppError): ...

def fetch_user(user_id: int) -> dict:
    try:
        return db.query(user_id)
    except ConnectionError as e:
        # Chain: preserves original traceback
        raise UpstreamError(f"db unreachable") from e
    except KeyError:
        raise NotFound(f"user {user_id} not found") from None   # suppress chain
    except (KeyError, ValueError) as e:
        log.warning("expected issue: %s", e)
        raise
    except Exception:
        log.exception("unexpected error fetching user %s", user_id)
        raise                          # re-raise after logging
    else:
        log.debug("user %s fetched ok", user_id)
    finally:
        cleanup_request_state()        # always runs
\`\`\`

**Rules:**
- **Never** use bare \`except:\` — it catches \`SystemExit\` and \`KeyboardInterrupt\`
- **Never** swallow exceptions silently — at minimum \`log.exception(...)\`
- Use \`raise X from e\` to chain (keeps traceback) — or \`from None\` to hide implementation details
- Create a **custom exception hierarchy** so callers can catch broad or narrow
- \`log.exception\` (inside \`except\`) auto-includes the traceback — use it instead of \`log.error("%s", e)\`
- \`else\` runs only if no exception — good place for "commit" logic
- \`finally\` always runs — resource cleanup, but prefer context managers when possible`,
        },
        {
          q: "Custom exceptions — how to design a hierarchy",
          a: `**Why custom exceptions?** So callers can catch your errors specifically without catching unrelated ones. Without them, \`except Exception:\` catches bugs, network errors, and your validation all mixed together.

\`\`\`python
# --- Design pattern: one base, branch by category ---
class AppError(Exception):
    """Base for all errors in this application.
    Callers can 'except AppError' to catch any of ours without catching stdlib errors.
    """

# Branch by failure MODE (what went wrong), not by WHERE
class ValidationError(AppError):
    """Input data failed validation."""

class NotFoundError(AppError):
    """Requested resource does not exist."""

class ConflictError(AppError):
    """Operation conflicts with current state (e.g., duplicate key)."""

class UpstreamError(AppError):
    """A downstream service failed. Might be retryable."""

class AuthError(AppError):
    """Authentication or authorization failed."""
\`\`\`

**Attach structured data — don't stuff everything into the message:**
\`\`\`python
class PaymentDeclined(AppError):
    def __init__(self, code: str, reason: str, retryable: bool) -> None:
        super().__init__(f"payment declined: {reason} ({code})")
        self.code = code                       # accessible on the exception
        self.reason = reason
        self.retryable = retryable

try:
    charge(...)
except PaymentDeclined as e:
    log.warning("declined %s: %s", e.code, e.reason)
    if e.retryable:
        retry()
\`\`\`

**Map to HTTP status codes at the boundary (FastAPI/Flask):**
\`\`\`python
@app.exception_handler(NotFoundError)
def not_found(request, exc): return JSONResponse({"error": str(exc)}, status_code=404)

@app.exception_handler(ValidationError)
def bad_req(request, exc):   return JSONResponse({"error": str(exc)}, status_code=400)

@app.exception_handler(ConflictError)
def conflict(request, exc):  return JSONResponse({"error": str(exc)}, status_code=409)
\`\`\`

**Rules:**
- Inherit from \`Exception\` (never \`BaseException\` directly — that catches Ctrl+C)
- Name ends with \`Error\` by convention (\`ValueError\`, \`TypeError\`, \`AppError\`)
- Shallow hierarchies beat deep ones — 2 levels is usually enough
- Carry structured fields, not just a string message`,
        },
        {
          q: "raise vs raise from vs raise from None",
          a: `Three subtle forms of raising. Interviewers love this.

\`\`\`python
# --- Plain raise (no chain) — resets exception context ---
def fetch(url):
    try:
        return requests.get(url)
    except ConnectionError:
        raise MyError("failed")          # ← loses original in logs (sort of)
\`\`\`
The original IS still shown in the traceback, with the message:
\`"During handling of the above exception, another exception occurred:"\`

\`\`\`python
# --- raise X from e — EXPLICIT chain ---
def fetch(url):
    try:
        return requests.get(url)
    except ConnectionError as e:
        raise MyError("failed") from e   # ← explicitly caused by e
\`\`\`
Traceback says: \`"The above exception was the direct cause of the following exception"\`. Use when you're **translating** an error from a lower layer into your domain's vocabulary.

\`\`\`python
# --- raise X from None — SUPPRESS chain ---
def get_user(user_id):
    try:
        return users[user_id]
    except KeyError:
        raise NotFoundError(f"user {user_id}") from None   # ← hide KeyError
\`\`\`
Traceback shows ONLY your \`NotFoundError\`. Use when the internal detail (here, that you used a dict) is **implementation noise** that would confuse callers.

\`\`\`python
# --- Bare raise — re-raise the CURRENT exception unchanged ---
def fetch(url):
    try:
        return requests.get(url)
    except ConnectionError:
        log.exception("connection failed")
        raise                            # ← preserves full original traceback
\`\`\`
Use when you just want to **log and continue** without wrapping.

**Summary:**

| Form | When to use |
|---|---|
| \`raise\` (bare) | log and let caller handle |
| \`raise NewError("x")\` | sometimes wraps, but shows both in traceback |
| \`raise NewError("x") from e\` | **translating layer** — you own the wrapping |
| \`raise NewError("x") from None\` | **hide internals** — implementation detail |

**Trap:** don't write \`raise e\` — it works but creates a misleading traceback pointing to the \`raise\` line. Just \`raise\` on its own re-raises cleanly.`,
        },
        {
          q: "Context manager for exception-safe resource handling",
          a: `Context managers are Python's answer to RAII / try-finally for resources. They ensure cleanup **even on exception**.

**The problem they solve:**
\`\`\`python
# ❌ Leaky — if .write raises, f stays open until GC
f = open("out.txt", "w")
f.write(data)
f.close()

# ✅ try/finally — correct but verbose
f = open("out.txt", "w")
try:
    f.write(data)
finally:
    f.close()                    # runs even on exception

# ✅✅ with — same guarantee, readable
with open("out.txt", "w") as f:
    f.write(data)                # closed automatically, exception propagates
\`\`\`

**Using contextlib.contextmanager for custom ones:**
\`\`\`python
from contextlib import contextmanager
import logging

log = logging.getLogger(__name__)

@contextmanager
def db_transaction(conn):
    try:
        yield conn               # code inside 'with' runs here
        conn.commit()            # only if no exception
    except Exception:
        conn.rollback()          # rollback on error
        raise                    # re-raise so caller knows
    finally:
        conn.close()             # always

with db_transaction(get_conn()) as conn:
    conn.execute("UPDATE users SET active = 0")
    conn.execute("DELETE FROM sessions WHERE user_id = ?", (user_id,))
    # if either query raises → rollback + re-raise
    # if both succeed → commit
# conn closed either way
\`\`\`

**Stacking contexts:**
\`\`\`python
with open("in.txt") as src, open("out.txt", "w") as dst:
    dst.write(src.read().upper())
# both files closed in reverse order, even on exception

# Dynamic stack — contextlib.ExitStack
from contextlib import ExitStack
with ExitStack() as stack:
    files = [stack.enter_context(open(p)) for p in paths]
    # all files closed when stack unwinds
\`\`\`

**Suppress a specific exception:**
\`\`\`python
from contextlib import suppress
with suppress(FileNotFoundError):
    os.remove("maybe.txt")       # no-op if file doesn't exist
\`\`\``,
        },
        {
          q: "Class-based context manager (__enter__ / __exit__)",
          a: `When you need more than \`@contextmanager\` gives you — reentrancy, state, async — write a class.

\`\`\`python
import time
import logging

log = logging.getLogger(__name__)

class Timer:
    """Measure elapsed time. Works as context manager AND has .elapsed attribute."""

    def __init__(self, label: str) -> None:
        self.label = label
        self.start: float | None = None
        self.elapsed: float | None = None

    def __enter__(self) -> "Timer":
        self.start = time.perf_counter()
        return self                              # whatever is bound to 'as'

    def __exit__(self, exc_type, exc_val, exc_tb) -> bool:
        self.elapsed = time.perf_counter() - self.start
        log.info("%s took %.2fms (failed=%s)",
                 self.label, self.elapsed * 1000, exc_type is not None)
        return False                             # ← DO NOT swallow exceptions

# Usage
with Timer("fetch users") as t:
    users = db.query(...)
print(f"elapsed: {t.elapsed:.3f}s")              # still accessible after 'with'
\`\`\`

**\`__exit__\` contract:**
- **Parameters**: \`(exc_type, exc_value, traceback)\` — all None if no exception
- **Return True** → the exception is SWALLOWED (use sparingly!)
- **Return False / None** → the exception PROPAGATES normally
- **Raise a new exception** → replaces the original

**Resource that MUST close, even on exception:**
\`\`\`python
class DatabaseConnection:
    def __init__(self, dsn: str) -> None:
        self.dsn = dsn
        self._conn = None

    def __enter__(self):
        self._conn = connect(self.dsn)
        return self._conn

    def __exit__(self, exc_type, exc, tb):
        try:
            if exc_type is None:
                self._conn.commit()
            else:
                self._conn.rollback()
        finally:
            self._conn.close()                   # always close, even if rollback fails
        return False                             # propagate
\`\`\`

**Async version** — same pattern but \`__aenter__\` / \`__aexit__\`:
\`\`\`python
class AsyncDB:
    async def __aenter__(self):
        self._conn = await connect_async(self.dsn)
        return self._conn
    async def __aexit__(self, exc_type, exc, tb):
        await self._conn.close()
        return False

async with AsyncDB("...") as conn:
    await conn.execute(...)
\`\`\`

**Rule:** use \`@contextmanager\` for simple cases (setup → yield → teardown). Use a class when you need state accessible after, custom methods, async, or reentrancy.`,
        },
        {
          q: "Tricky exception patterns",
          a: `**1. \`else\` clause — runs only if no exception was raised**
\`\`\`python
try:
    result = risky()
except ValueError:
    handle()
else:
    # runs ONLY if try succeeded, BEFORE finally
    commit(result)           # "happy path" code goes here, not in try
finally:
    cleanup()
\`\`\`

Why? Keeps the try block small (only the risky call), so you don't accidentally catch errors from \`commit()\`.

**2. Catching multiple types**
\`\`\`python
try:
    x = d[k] / n
except (KeyError, ZeroDivisionError) as e:     # tuple of types
    log.warning("expected: %s", e)
\`\`\`

**3. Exception groups (3.11+) — when many things fail at once**
\`\`\`python
try:
    async with asyncio.TaskGroup() as tg:
        tg.create_task(a())   # may raise
        tg.create_task(b())   # may also raise
except* ValueError as eg:     # catch all ValueErrors from the group
    for e in eg.exceptions: log.warning(e)
except* ConnectionError as eg:
    retry_all()
\`\`\`

**4. Cleanup that might itself fail**
\`\`\`python
try:
    do_work()
finally:
    try:
        cleanup()
    except Exception:
        log.exception("cleanup failed")  # don't let cleanup mask original
\`\`\`

**5. Re-raising with more context**
\`\`\`python
try:
    process(row)
except Exception as e:
    e.add_note(f"row_id={row.id}")       # 3.11+ — attach info without losing type
    raise
\`\`\`

**6. The bare \`except:\` trap**
\`\`\`python
# ❌ catches EVERYTHING including KeyboardInterrupt and SystemExit
try: ...
except: ...

# ✅ catches "real" errors, leaves Ctrl+C alone
try: ...
except Exception: ...
\`\`\`

**7. Asserts are NOT error handling**
\`\`\`python
# ❌ asserts are STRIPPED when Python runs with -O flag
def withdraw(amount):
    assert amount > 0        # production may skip this entirely!

# ✅ explicit validation
def withdraw(amount):
    if amount <= 0:
        raise ValueError("amount must be positive")
\`\`\``,
        },
      ],
    },
  ];

  const categories = [
    { id: "all", label: "Everything" },
    { id: "must", label: "⭐ Interview Must-Have" },
    { id: "basics", label: "Basics" },
    { id: "oop", label: "OOP" },
    { id: "advanced", label: "Advanced" },
    { id: "stdlib", label: "Std Lib" },
    { id: "testing", label: "Testing" },
    { id: "performance", label: "Performance" },
    { id: "coding", label: "Coding" },
    { id: "architecture", label: "Architecture" },
    { id: "tricky", label: "Tricky" },
    { id: "extras", label: "Pythonic" },
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sections
      .map((sec, idx) => ({ ...sec, idx }))
      .filter((sec) => activeCategory === "all" || sec.cat === activeCategory)
      .map((sec) => ({
        ...sec,
        items: sec.items.filter(
          (it) =>
            !q ||
            it.q.toLowerCase().includes(q) ||
            it.a.toLowerCase().includes(q)
        ),
      }))
      .filter((sec) => sec.items.length > 0);
  }, [query, activeCategory]);

  const matchCount = useMemo(
    () => filtered.reduce((n, s) => n + s.items.length, 0),
    [filtered]
  );

  const totalItems = sections.reduce((n, s) => n + s.items.length, 0);
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const progress = Math.round((checkedCount / totalItems) * 100);

  // Highlight all case-insensitive occurrences of `q` inside `text`.
  // Uses indexOf (no regex) so user input doesn't need escaping.
  const highlight = (text, q) => {
    const needle = q.trim();
    if (!needle) return text;
    const lower = text.toLowerCase();
    const lowerNeedle = needle.toLowerCase();
    const parts = [];
    let i = 0;
    let key = 0;
    while (i < text.length) {
      const hit = lower.indexOf(lowerNeedle, i);
      if (hit === -1) {
        parts.push(text.slice(i));
        break;
      }
      if (hit > i) parts.push(text.slice(i, hit));
      parts.push(
        <mark
          key={key++}
          className="bg-teal-400/25 text-teal-100 rounded px-0.5 py-[1px]"
        >
          {text.slice(hit, hit + needle.length)}
        </mark>
      );
      i = hit + needle.length;
    }
    return parts;
  };

  // Simple markdown-ish renderer: code blocks + inline code + bold
  const renderAnswer = (text) => {
    const parts = [];
    const regex = /```(\w*)\n([\s\S]*?)```/g;
    let lastIdx = 0;
    let m;
    let key = 0;
    while ((m = regex.exec(text)) !== null) {
      if (m.index > lastIdx) {
        parts.push(
          <ProseBlock key={key++} text={text.slice(lastIdx, m.index)} />
        );
      }
      parts.push(
        <pre
          key={key++}
          className="my-3 overflow-x-auto rounded-md bg-[#0d0f12] px-4 py-3 text-[13px] leading-relaxed text-zinc-100 border border-zinc-800"
          style={{
            fontFamily:
              "'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, monospace",
          }}
        >
          <code>{m[2]}</code>
        </pre>
      );
      lastIdx = regex.lastIndex;
    }
    if (lastIdx < text.length) {
      parts.push(<ProseBlock key={key++} text={text.slice(lastIdx)} />);
    }
    return parts;
  };

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: "#14161a",
        color: "#e4e4e7",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* Top banner */}
      <div className="relative overflow-hidden border-b border-zinc-800 bg-[#1a1d22]">
        <div className="relative max-w-6xl mx-auto px-6 py-10">
          <div className="flex items-center gap-2 mb-4 text-zinc-500 text-xs uppercase tracking-[0.2em] font-medium">
            <Terminal size={14} />
            <span>Python Interview Prep · 2026</span>
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold text-zinc-100 leading-[1.1] tracking-tight"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Core Python —{" "}
            <span className="text-teal-400">Trainee to Lead</span>
          </h1>
          <p className="mt-4 max-w-2xl text-zinc-400 text-[15px] leading-relaxed">
            A complete, categorized interview guide. Decorators, generators,
            GIL, hashing, GC, sliding window, parentheses, SOLID, and every
            tricky gotcha. Check items off as you review.
          </p>

          {/* Progress bar */}
          <div className="mt-6 max-w-md">
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-2 font-medium">
              <span>
                <Check size={12} className="inline mr-1 text-teal-400" />
                {checkedCount} / {totalItems} reviewed
              </span>
              <div className="flex items-center gap-3">
                <span
                  className={`text-[10px] uppercase tracking-wider transition ${
                    saveState === "saving"
                      ? "text-amber-400"
                      : saveState === "saved"
                      ? "text-teal-400"
                      : saveState === "error"
                      ? "text-red-400"
                      : "text-zinc-600"
                  }`}
                >
                  {saveState === "saving" && "saving…"}
                  {saveState === "saved" && "✓ saved"}
                  {saveState === "error" && "⚠ save failed"}
                  {saveState === "idle" && (storageReady ? "auto-saved" : "loading…")}
                </span>
                <span className="text-zinc-500">{progress}%</span>
              </div>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            {checkedCount > 0 && (
              <button
                onClick={clearAll}
                className="mt-3 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-zinc-500 hover:text-red-400 border border-zinc-800 hover:border-red-900 rounded-md px-3 py-1.5 transition"
              >
                <RotateCcw size={12} />
                Clear all progress
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="sticky top-0 z-20 border-b border-zinc-800 bg-[#14161a]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 space-y-3">
          {/* Big search */}
          <div className="relative group">
            {/* Teal glow behind input on focus */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-px rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"
              style={{
                background:
                  "radial-gradient(120% 140% at 50% 0%, rgba(45,212,191,0.25), rgba(45,212,191,0) 60%)",
                filter: "blur(14px)",
              }}
            />
            <div className="relative flex items-center">
              <Search
                size={18}
                className="absolute left-4 text-zinc-500 group-focus-within:text-teal-400 transition-colors"
              />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search decorators, GIL, MRO, hashing, sliding window…"
                aria-label="Search questions"
                className="w-full bg-[#1a1d22] border border-zinc-800 rounded-xl pl-12 pr-36 py-3.5 text-zinc-100 text-[15px] placeholder-zinc-500 focus:outline-none focus:border-teal-500/70 focus:ring-2 focus:ring-teal-500/20 shadow-[0_1px_0_rgba(255,255,255,0.02)_inset] transition-all"
              />
              <div className="absolute right-3 flex items-center gap-2">
                {query ? (
                  <>
                    <span
                      className="text-[11px] font-medium text-teal-400 tabular-nums"
                      aria-live="polite"
                    >
                      {matchCount} {matchCount === 1 ? "match" : "matches"}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setQuery("");
                        searchRef.current?.focus();
                      }}
                      className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800 transition"
                      aria-label="Clear search"
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <div className="hidden sm:flex items-center gap-1 text-[10px] text-zinc-500 font-medium">
                    <kbd className="px-1.5 py-0.5 rounded border border-zinc-700 bg-[#0d0f12] font-mono leading-none">
                      /
                    </kbd>
                    <span className="text-zinc-600">or</span>
                    <kbd className="px-1.5 py-0.5 rounded border border-zinc-700 bg-[#0d0f12] font-mono inline-flex items-center gap-0.5 leading-none">
                      <Command size={10} />K
                    </kbd>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Category pills — horizontal scroll on small screens, wrap on large */}
          <div className="flex flex-nowrap md:flex-wrap gap-1.5 overflow-x-auto md:overflow-visible -mx-1 px-1 pb-0.5 md:pb-0">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`flex-shrink-0 text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-md border transition font-medium ${
                  activeCategory === c.id
                    ? "bg-teal-500 text-zinc-900 border-teal-500 shadow-[0_0_0_3px_rgba(20,184,166,0.15)]"
                    : "bg-[#1a1d22] text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-zinc-200"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#1a1d22] border border-zinc-800 mb-4">
              <Search size={18} className="text-zinc-500" />
            </div>
            <p className="text-zinc-300 text-sm font-medium">
              No matches for{" "}
              <span className="text-teal-400">“{query}”</span>
            </p>
            <p className="mt-1 text-zinc-500 text-xs">
              Try a shorter query or switch category.
            </p>
            {(query || activeCategory !== "all") && (
              <button
                onClick={() => {
                  setQuery("");
                  setActiveCategory("all");
                  searchRef.current?.focus();
                }}
                className="mt-4 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-zinc-400 hover:text-teal-400 border border-zinc-800 hover:border-teal-900 rounded-md px-3 py-1.5 transition"
              >
                <RotateCcw size={12} />
                Reset filters
              </button>
            )}
          </div>
        )}

        {filtered.map((sec) => {
          const isOpen = openSections[sec.idx];
          return (
            <section
              key={sec.idx}
              className="border border-zinc-800 rounded-lg overflow-hidden bg-[#1a1d22]"
            >
              <button
                onClick={() => toggle(sec.idx)}
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-[#1f2329] transition text-left"
              >
                <div className="text-teal-400 flex-shrink-0">{sec.icon}</div>
                <div className="flex-1">
                  <h2
                    className="text-zinc-100 font-bold text-lg"
                    style={{ fontFamily: "'Georgia', serif" }}
                  >
                    {sec.title}
                  </h2>
                  <div className="text-[11px] uppercase tracking-[0.15em] text-zinc-500 mt-0.5 font-medium">
                    {sec.level} · {sec.items.length} topics
                  </div>
                </div>
                {isOpen ? (
                  <ChevronDown size={18} className="text-zinc-500" />
                ) : (
                  <ChevronRight size={18} className="text-zinc-500" />
                )}
              </button>

              {isOpen && (
                <div className="border-t border-zinc-800 divide-y divide-zinc-800/70">
                  {sec.items.map((it, i) => {
                    const id = `${sec.idx}-${i}`;
                    const isChecked = !!checked[id];
                    return (
                      <div
                        key={i}
                        className="px-5 py-5 hover:bg-[#1f2329]/50 transition"
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => tick(id)}
                            className={`flex-shrink-0 mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                              isChecked
                                ? "bg-teal-500 border-teal-500"
                                : "border-zinc-600 hover:border-teal-500 bg-transparent"
                            }`}
                            aria-label="Mark reviewed"
                          >
                            {isChecked && (
                              <Check
                                size={12}
                                className="text-zinc-900"
                                strokeWidth={3}
                              />
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <h3
                              className={`font-semibold text-[15px] mb-2 ${
                                isChecked
                                  ? "line-through text-zinc-600"
                                  : "text-zinc-100"
                              }`}
                            >
                              {highlight(it.q, query)}
                            </h3>
                            <div className="text-zinc-300 text-[14px] leading-relaxed">
                              {renderAnswer(it.a)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* Footer / final tips */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="border border-teal-900/50 rounded-lg p-6 bg-teal-950/20">
          <div className="flex items-center gap-2 text-teal-400 mb-3">
            <Brain size={18} />
            <h3 className="uppercase tracking-[0.15em] text-xs font-bold">
              Interview Day Checklist
            </h3>
          </div>
          <ul className="space-y-2 text-zinc-300 text-[14px] leading-relaxed">
            <li>• Think out loud — narrate your approach BEFORE coding.</li>
            <li>• State time + space complexity after each solution.</li>
            <li>• Ask clarifying questions: input size, edge cases, unicode?</li>
            <li>• Write working brute-force first, then optimize if asked.</li>
            <li>• Know when to use a set/dict for O(1) lookup vs list.</li>
            <li>
              • Python-specific strengths: comprehensions, generators, context
              managers, dataclasses.
            </li>
            <li>• Know the GIL story cold — it's the #1 senior Python question.</li>
            <li>
              • Have one production war story ready for each: threading,
              multiprocessing, async.
            </li>
          </ul>
        </div>
        <div className="text-center text-zinc-600 text-[11px] uppercase tracking-[0.25em] mt-8">
          Good luck on Monday — you've got this.
        </div>
      </div>
    </div>
  );
}

/* ------------ helper components ------------ */

function ProseBlock({ text }) {
  // split by paragraphs, render bold (**) and inline code (`)
  const paragraphs = text.split(/\n\n+/);
  return (
    <>
      {paragraphs.map((p, i) => {
        const trimmed = p.trim();
        if (!trimmed) return null;

        // Table detection
        if (trimmed.includes("|") && trimmed.includes("---")) {
          return <TableBlock key={i} src={trimmed} />;
        }

        // List detection
        if (/^(-|\*|\d+\.)\s/.test(trimmed.split("\n")[0])) {
          const lines = trimmed.split("\n");
          return (
            <ul key={i} className="my-2 space-y-1 pl-4">
              {lines.map((ln, j) => (
                <li key={j} className="text-zinc-300">
                  {renderInline(ln.replace(/^(-|\*|\d+\.)\s/, ""))}
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={i} className="my-2 text-zinc-300">
            {trimmed.split("\n").map((line, j) => (
              <span key={j}>
                {j > 0 && <br />}
                {renderInline(line)}
              </span>
            ))}
          </p>
        );
      })}
    </>
  );
}

function renderInline(text) {
  // handle `code` and **bold**
  const nodes = [];
  const regex = /(`[^`]+`|\*\*[^*]+\*\*)/g;
  let last = 0;
  let m;
  let key = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) nodes.push(<span key={key++}>{text.slice(last, m.index)}</span>);
    const tok = m[0];
    if (tok.startsWith("`")) {
      nodes.push(
        <code
          key={key++}
          className="px-1.5 py-0.5 mx-0.5 rounded bg-[#0d0f12] text-teal-300 text-[12.5px] border border-zinc-800"
          style={{
            fontFamily:
              "'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, monospace",
          }}
        >
          {tok.slice(1, -1)}
        </code>
      );
    } else {
      nodes.push(
        <strong key={key++} className="text-zinc-100 font-semibold">
          {tok.slice(2, -2)}
        </strong>
      );
    }
    last = regex.lastIndex;
  }
  if (last < text.length) nodes.push(<span key={key++}>{text.slice(last)}</span>);
  return nodes;
}

function TableBlock({ src }) {
  const rows = src.trim().split("\n").filter((l) => l.trim());
  const header = rows[0].split("|").map((c) => c.trim()).filter(Boolean);
  const bodyRows = rows.slice(2).map((r) =>
    r.split("|").map((c) => c.trim()).filter((_, i, arr) => !(i === 0 && _ === "") && !(i === arr.length - 1 && _ === ""))
  );
  return (
    <div className="my-3 overflow-x-auto">
      <table className="w-full text-[13px] border border-zinc-800 rounded-md overflow-hidden">
        <thead className="bg-[#0d0f12]">
          <tr>
            {header.map((h, i) => (
              <th
                key={i}
                className="px-3 py-2 text-left text-teal-400 font-semibold border-b border-zinc-800 uppercase text-[11px] tracking-wider"
              >
                {renderInline(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((r, i) => (
            <tr key={i} className="border-b border-zinc-800/60 last:border-0 hover:bg-[#1f2329]/40">
              {r.map((c, j) => (
                <td key={j} className="px-3 py-2 text-zinc-300 align-top">
                  {renderInline(c)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
