# CIn/UFPE - Data Base Project (Controle de concorrência)
This is a project for the master degree class Banco de Dados at CIn/UFPE. Year 2019.1.

### Team
* Denisson Augusto Bastos Leal(dabl@cin.ufpe.br)
* Mailton Fernandes de Carvalho (mfc2@cin.ufpe.br)

### Clone this project
$ https://github.com/mailtonfcarvalho/db-02.git

### Project Specification

This project is the specification of the Concurrency Control Technique of DBMS. Here is used a control technique that are used to ensure the noninterference or isolation property of concurrently executing transactions.

The technique used is shared/exclusive locking scheme. When we use the the system must enforce the following rules:

1. A transaction T must issue the operation read_lock(X) or write_lock(X) before any read_item(X) operation is performed in T.
2. A transaction T must issue the operation write_lock(X) before any write_item(X) operation is performed in T.
3. A transaction T must issue the operation unlock(X) after all read_item(X) and write_item(X) operations are completed in T.3
4. A transaction T will not issue a read_lock(X) operation if it already holds a read (shared) lock or a write (exclusive) lock on item X. This rule may be relaxed, as we discuss shortly.
5. A transaction T will not issue a write_lock(X) operation if it already holds a read (shared) lock or write (exclusive) lock on item X. This rule may also be relaxed, as we discuss shortly.
6. A transaction T will not issue an unlock(X) operation unless it already holds a read (shared) lock or a write (exclusive) lock on item X.

### Referencia: 
http://iips.icci.edu.iq/images/exam/databases-ramaz.pdf
